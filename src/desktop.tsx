import React from 'react'
import ReactDOM from 'react-dom/client'
import DesktopAppShell from './shell/desktop-app-shell'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DesktopAppShell />
  </React.StrictMode>,
)
