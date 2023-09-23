import { BrowserWindow, ipcMain } from 'electron'
import logger from '../../logger'
import db from '../../db'

export default function () {
  ipcMain.on('db:find', async (_event, args) => {
    try {
      const docs = await db.findOne(args)
      BrowserWindow.fromId(1).webContents.send('db:rt', docs)
    } catch (err) {
      logger.error(`IPC db find error -- ${err}`)
    }
  })

  ipcMain.on('db:update', async (_event, args) => {
    try {
      const { key, value } = args
      const result = await db.update(
        { key: key },
        { $set: { value: value } },
        { upsert: true }
      )
      if (result) {
        const docs = await db.findOne({ key: key })
        BrowserWindow.fromId(1).webContents.send('db:rt', docs)
      }
    } catch (err) {
      logger.error(`IPC db update error -- ${err}`)
    }
  })
}
