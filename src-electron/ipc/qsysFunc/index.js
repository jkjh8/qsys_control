import { ipcMain } from 'electron'
import logger from 'src-electron/logger'

import {
  getQsysStatus,
  getQsysGainMute,
  setQsysPaFeedback
} from 'src-electron/qsys/toQsys'

export default function () {
  ipcMain.on('qsys:refresh', (e, device) => {
    const { deviceId } = device
    try {
      logger.warn(`qsys refresh -- ${deviceId}`)
      // getQsysStatus(deviceId)
      getQsysGainMute(deviceId)
      // setQsysPaFeedback(deviceId)

      // getPaConfig(deviceId)
    } catch (error) {
      console.log(error)
    }
  })
}
