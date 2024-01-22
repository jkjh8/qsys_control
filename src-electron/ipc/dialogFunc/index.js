import { BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { initFolderFunctions } from 'src-electron/functions/folders'
import db from 'src-electron/db'
import logger from 'src-electron/logger'

export default function () {
  initFolderFunctions()
}
