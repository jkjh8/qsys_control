import { BrowserWindow } from 'electron'
import logger from 'src-electron/logger'
import dbFunc from './dbFunc'
import dialogFunc from './dialogFunc'
import socketFunc from './socketFunc'
import qsysFunc from './qsysFunc'

export default function () {
  dbFunc()
  dialogFunc()
  socketFunc()
  qsysFunc()
}

function rtIPC(channel, obj) {
  try {
    BrowserWindow.fromId(1).webContents.send(channel, obj)
  } catch (err) {
    logger.error(
      `IPC return error -- channel ${channel}, value: ${obj} -- ${err}`
    )
  }
}

export { rtIPC }
