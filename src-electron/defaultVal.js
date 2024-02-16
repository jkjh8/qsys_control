import { app } from 'electron'
import db from './db'
import logger from './logger'

const folder = app.getPath('documents')
logger.info('default folder: ' + folder)

const Status = {
  serverAddr: '127.0.0.1',
  serverPort: 2990,
  deviceId: '',
  connected: false,
  mediafolder: folder
}

async function setDefaultValueFormDb() {
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

export { Status, setDefaultValueFormDb }
