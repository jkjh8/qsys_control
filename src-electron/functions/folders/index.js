import { BrowserWindow, dialog, ipcMain, shell } from 'electron'
import db from 'src-electron/db'
import { Status } from 'src-electron/defaultVal'
import logger from 'src-electron/logger'

const initFolderFunctions = async () => {
  ipcMain.on('folder:set', async () => {
    const folder = dialog.showOpenDialogSync({
      title: 'Select a Media Folder',
      properties: ['openDirectory']
    })
    await db.update(
      { key: 'mediafolder' },
      { $set: { value: folder[0] } },
      { upsert: true }
    )
    Status.mediafolder = folder[0]
    logger.info(`Media folder updated successfully -- ${folder[0]}`)
    BrowserWindow.fromId(1).webContents.send('status:rt', Status)
  })

  ipcMain.on('folder:open', () => {
    try {
      shell.openPath(Status.mediafolder)
    } catch (error) {
      logger.error(`Media folder open failed -- ${error}`)
    }
  })
}

export { initFolderFunctions }
