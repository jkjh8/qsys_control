import { app, BrowserWindow } from 'electron'
import path from 'path'
import os from 'os'

import initIPC from './ipc'

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    x: 100,
    y: 100,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // sandbox: false,
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // start IPC
  initIPC()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  const platform = process.platform || os.platform()
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
