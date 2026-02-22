import type { DesktopBridge } from '../adapters/desktop-adapter'

declare global {
  interface Window {
    desktopBridge: DesktopBridge
  }
}

export {}
