import { BrowerWindow as bw, ipcMain } from 'electron'
import logger from '../../logger'
import db from '../../db'

ipcMain.on('command', (e, args) => {
  switch (args.command) {
    case 'getServerAddress':
      db.findOne({ key: 'serveraddress' }, function (err, docs) {
        if (err) return logger.error(`IPC Commands Error: ${err}`)
        rtData(docs)
      })
      break
    case 'getDeviceId':
      db.findOne({ key: 'deviceid' }, function (err, docs) {
        if (err) return logger.error(`IPC Commands Error: ${err}`)
        rtData(docs)
      })
      break
    case 'getMediaFolder':
      db.findOne({ key: 'mediafolder' }, function (err, docs) {
        if (err) return logger.error(`IPC Commands Error: ${err}`)
        rtData(docs)
      })
      break
  }
})

function rtData(args) {
  if (args) {
    bw.fromId(1).webContents.send('data', { ...args })
  }
}
