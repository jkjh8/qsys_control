import { BrowserWindow as bw, ipcMain, dialog, shell } from 'electron'
import { Status } from 'src-electron/defaultVal'
import logger from 'src-electron/logger'
import qsysFunc from './qsysFunc'
import { qsysArr } from '../qsys/devices'
import { socket } from '../socket'
// import { socketConnect } from '../socket'

export default function () {
  // open ui
  ipcMain.on('ui:open', () => {
    console.log('ui: open')
    // socketConnect('127.0.0.1', 'qsys')
    rtIPC('device:rt', qsysArr)
  })
  // status rt
  ipcMain.on('status:get', () =>
    bw.fromId(1).webContents.send('status:rt', Status)
  )

  ipcMain.on('socket:devices', () => {
    socket.emit('device:get')
  })

  // folder functions
  ipcMain.on('folder:set', async () => {
    try {
      const f = dialog.showOpenDialogSync({
        title: '미디어 폴더를 선택하세요',
        properties: ['openDirectory']
      })
      logger.info(
        `media folder updated - ${await db.update(
          { key: 'mediaFolder' },
          { $set: { value: f[0] } },
          { upsert: true }
        )}`
      )
    } catch (error) {
      logger.error(`Set Media folder error -- ${error}`)
    }
  })

  ipcMain.on('folder:open', () => {
    try {
      shell.openPath(Status.mediafolder)
    } catch (error) {
      logger.error(`media folder open error -- ${error}`)
    }
  })

  // db functions
  ipcMain.on('db:find', async (_e, args) => {
    try {
      bw.fromId(1).webContents.send(
        'db:rt',
        await db.findOne({ key: args.key })
      )
    } catch (error) {
      logger.error(`db find error -- ${error}`)
    }
  })

  ipcMain.on('db:update', async (_e, args) => {
    try {
      const r = await db.update(
        { key: args.key },
        { $set: { value: args.value } },
        { upsert: true }
      )
      if (r) {
        bw.fromId(1).webContents.send(
          'db:rt',
          await db.findOne({ key: args.key })
        )
      }
    } catch (error) {
      logger.error(`db update error - ${error}`)
    }
  })

  qsysFunc()
}

function rtIPC(channel, obj) {
  try {
    bw.fromId(1).webContents.send(channel, obj)
  } catch (err) {
    logger.error(
      `IPC return error -- channel ${channel}, value: ${obj} -- ${err}`
    )
  }
}

function rtStatus() {
  bw.fromId(1).webContents.send('status', Status)
}

export { rtIPC, rtStatus }
