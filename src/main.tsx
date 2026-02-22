import React from 'react'
import ReactDOM from 'react-dom/client'
import WebAppShell from './shell/web-app-shell'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebAppShell />
  </React.StrictMode>,
)
