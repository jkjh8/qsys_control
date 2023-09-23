import { BrowserWindow, dialog, ipcMain, shell } from 'electron'
import db from 'src-electron/db'
import logger from 'src-electron/logger'

export default function () {
  ipcMain.on('dialog:folder', async () => {
    const folders = dialog.showOpenDialogSync({
      title: 'Select a media folder',
      properties: ['openDirectory']
    })
    try {
      if (folders && folders.length) {
        const result = await db.update(
          { key: 'mediafolder' },
          { $set: { value: folders[0] } },
          { upsert: true }
        )
        if (result) {
          const docs = await db.findOne({ key: 'mediafolder' })
          BrowserWindow.fromId(1).webContents.send('db:rt', docs)
        }
      }
    } catch (error) {
      logger.error(`Media folder select failed -- ${error}`)
    }
  })

  ipcMain.on('dialog:openFolder', (_event, folderPath) => {
    try {
      shell.openPath(folderPath)
    } catch (error) {
      logger.error(`Media folder open failed -- ${error}`)
    }
  })
}
