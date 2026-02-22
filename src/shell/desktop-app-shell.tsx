import React, { useMemo } from 'react'
import App from '../App'
import { createDesktopAdapter } from '../adapters/desktop-adapter'

const DesktopAppShell = () => {
  const adapter = useMemo(() => {
    if (!window.desktopBridge) {
      throw new Error('DESKTOP_BRIDGE_UNAVAILABLE')
    }
    return createDesktopAdapter(window.desktopBridge)
  }, [])

  return <App adapter={adapter} />
}

export default DesktopAppShell
