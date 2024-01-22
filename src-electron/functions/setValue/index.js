import { Status } from 'src-electron/defaultVal'
import db from 'src-electron/db'
import logger from 'src-electron/logger'

async function initVal() {
  const setupVal = await db.find()
  logger.info('init setup value from db')

  for (const item of setupVal) {
    switch (item.key) {
      case 'serverAddr':
        Status.serverAddr = item.value
        break
      case 'serverPort':
        Status.serverPort = item.value
        break
      case 'deviceId':
        Status.deviceId = item.value
        break
      case 'mediafolder':
        Status.mediafolder = item.value
        break
    }
  }
}

export { initVal }
