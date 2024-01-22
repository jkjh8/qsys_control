import { BrowserWindow } from 'electron'
import { Status } from 'src-electron/defaultVal'
import logger from 'src-electron/logger'
import dbFunc from './dbFunc'
import dialogFunc from './dialogFunc'
import socketFunc from './socketFunc'
import qsysFunc from './qsysFunc'
import statusFunc from './statusFunc'

export default function () {
  statusFunc()
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

function rtStatus() {
  BrowserWindow.fromId(1).webContents.send('status', Status)
}

export { rtIPC, rtStatus }
