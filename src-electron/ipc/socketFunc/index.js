import { BrowserWindow, ipcMain } from 'electron'
import logger from '../../logger'
import db from 'src-electron/db'
import { socket, socketConnect } from 'app/src-electron/socket'

export default function () {
  ipcMain.on('socket:start', async () => {
    try {
      const addr = await db.findOne({ key: 'serveraddress' })
      if (!addr) return logger.error('server address not found')

      const uid = await db.findOne({ key: 'deviceid' })
      if (!uid) return logger.error('device id not found')

      await socketConnect(addr.value, uid.value)
    } catch (err) {
      logger.error(`IPC socket connect error -- ${err}`)
    }
  })
}
