import { BrowserWindow, ipcMain } from 'electron'
import logger from '../../logger'
import { socketConnect } from 'app/src-electron/socket'

export default function () {
  ipcMain.on('socket:start', async () => {
    try {
      await socketConnect()
    } catch (err) {
      logger.error(`IPC socket connect error -- ${err}`)
    }
  })
}
