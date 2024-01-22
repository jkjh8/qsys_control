import { BrowserWindow, ipcMain } from 'electron'
import { initVal } from 'src-electron/functions/setValue'
import refreshDeviceId from 'src-electron/functions/deviceId'
import logger from 'src-electron/logger'
import { Status } from 'src-electron/defaultVal'

export default function () {
  ipcMain.on('status:get', () => {
    BrowserWindow.fromId(1).webContents.send('status:rt', Status)
  })
  ipcMain.on('status:deviceId', async () => {
    await refreshDeviceId()
  })
}
