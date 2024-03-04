import { app, BrowserWindow } from 'electron'
import path from 'path'
import os from 'os'

import initIPC from './ipc'
import { setDefaultValueFormDb } from 'src-electron/defaultVal'
import { socketConnect } from './socket'

let mainWindow

async function createWindow() {
  await setDefaultValueFormDb()
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
  // tcp server open move ipc return function
  // getTcpSocket(2990, '127.0.0.1')
  socketConnect('127.0.0.1', 'qsys')
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
