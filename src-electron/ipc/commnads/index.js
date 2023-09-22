import { BrowerWindow as bw, ipcMain } from 'electron'
import logger from 'src-electron/logger'
import db from 'src-electron/db'

ipcMain.on('command', (e, args) => {
  switch (args.command) {
    case 'getServerAddress':
      db.findOne({ key: 'serveraddress' }, function (err, docs) {
        if (err) return logger.error(`IPC Commands Error -- ${err}`)
        rtData(docs)
      })
      break
    case 'getDeviceId':
      db.findOne({ key: 'deviceid' }, function (err, docs) {
        if (err) return logger.error(`IPC Commands Error -- ${err}`)
        rtData(docs)
      })
      break
    case 'getMediaFolder':
      db.findOne({ key: 'mediafolder' }, function (err, docs) {
        if (err) return logger.error(`IPC Commands Error -- ${err}`)
        rtData(docs)
      })
      break
    case 'updateServerAddress':
      db.update(
        { key: 'serveraddress' },
        { $set: { value: args.value } },
        { upsert: true },
        function (err, num) {
          if (err) return logger.error(`Db update failed --${err}`)
          console.log(num)
        }
      )
  }
})

function rtData(args) {
  if (args) {
    bw.fromId(1).webContents.send('data', { ...args })
  }
}
