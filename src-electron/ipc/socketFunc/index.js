import { BrowserWindow, ipcMain } from 'electron'
import logger from '../../logger'
import db from 'src-electron/db'
import { socket, socketConnect } from 'app/src-electron/socket'
import { Status } from 'src-electron/defaultVal'

export default function () {
  ipcMain.on('socket:start', async () => {
    try {
      await socketConnect(Status.serverAddr, Status.deviceId)
    } catch (err) {
      logger.error(`IPC socket connect error -- ${err}`)
    }
  })

  ipcMain.on('socket:devices', () => {
    console.log('get devices')
    socket.emit('bridge', JSON.stringify({ key: 'getDevices', type: 'qsys' }))
  })
}
