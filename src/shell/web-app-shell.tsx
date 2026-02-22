import React, { useCallback, useMemo, useRef } from 'react'
import App from '../App'
import { createWebAdapter } from '../adapters/web-adapter'
import type { OpenFilePickerApi, SaveFilePickerApi } from '../core/markdownFileService'

const WebAppShell = () => {
  const openFileInputRef = useRef<HTMLInputElement>(null)
  const pendingResolveRef = useRef<((file: File | null) => void) | null>(null)

  const requestFile = useCallback((): Promise<File | null> => {
    return new Promise((resolve) => {
      if (pendingResolveRef.current) {
        pendingResolveRef.current(null)
      }
      pendingResolveRef.current = resolve
      const input = openFileInputRef.current
      if (!input) {
        pendingResolveRef.current = null
        resolve(null)
        return
      }
      input.click()
    })
  }, [])

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    event.target.value = ''
    const resolve = pendingResolveRef.current
    pendingResolveRef.current = null
    resolve?.(file)
  }, [])

  const adapter = useMemo(
    () =>
      createWebAdapter({
        openFilePicker: window as OpenFilePickerApi,
        saveFilePicker: window as SaveFilePickerApi,
        fallbackOpenFile: requestFile
      }),
    [requestFile]
  )

  return (
    <>
      <App adapter={adapter} />
      <input
        ref={openFileInputRef}
        type="file"
        accept=".md,.markdown,text/markdown"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  )
}

export default WebAppShell
