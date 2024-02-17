import logger from '../logger'
import { BrowserWindow as bw } from 'electron'
import { updateDevices } from 'src-electron/qsys'

export default async function (commands) {
  try {
    const { comm, value } = JSON.parse(commands)
    switch (comm) {
      case 'qsys:devices':
        updateDevices(value)
        bw.fromId(1).webContents.send('devices:rt', value)
        break
    }
  } catch (error) {
    logger.error(`tcp commands error: ${error}`)
  }
}
