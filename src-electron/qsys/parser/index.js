import { BrowserWindow } from 'electron'
import { qsysData } from '..'
import byMethod from './byMethod'
import byId from './byId'
import { socket } from 'src-electron/socket'
/*
id
3001 = get pa gain mute all

*/

export default function (id, rt) {
  // id keys check
  if (Object.keys(qsysData).includes(id) === false) {
    qsysData[id] = {}
  }
  for (let val of rt) {
    if (val) {
      const data = JSON.parse(val)

      if (Object.keys(data).includes('method')) {
        byMethod(id, data.method, data.params)
      }
      if (Object.keys(data).includes('id')) {
        byId(id, data)
      }
    }
  }
  BrowserWindow.fromId(1).webContents.send('qsys:data', qsysData)
  socket.emit('qsys:data', JSON.stringify(qsysData))
}
