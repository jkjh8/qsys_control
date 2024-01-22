import { BrowserWindow } from 'electron'
import { v4 as uuidv4 } from 'uuid'
import { Status } from 'src-electron/defaultVal'
import db from 'src-electron/db'
import logger from 'src-electron/logger'

export default async function setDeviceId() {
  const uid = uuidv4()
  Status.deviceId = uid
  await db.update(
    { key: 'deviceId' },
    { $set: { value: uid } },
    { upsert: true }
  )
  BrowserWindow.fromId(1).webContents.send('status:rt', Status)
  logger.info(`DeviceId updated successfully, ${Status.deviceId}`)
}
