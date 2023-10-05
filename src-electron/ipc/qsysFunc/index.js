import { ipcMain } from 'electron'
import logger from 'src-electron/logger'

import {
  getPaConfig,
  getStatus,
  setPaFeedback
} from 'src-electron/qsys/commands'

export default function () {
  ipcMain.on('qsys:refresh', (e, device) => {
    const { deviceId } = device
    try {
      console.log(deviceId)
      // getPaGainMute(deviceId)
      getStatus(deviceId)
      setPaFeedback(deviceId)
      getPaConfig(deviceId)
    } catch (error) {
      console.log(error)
    }
  })
}
