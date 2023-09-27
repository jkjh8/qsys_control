import { BrowserWindow } from 'electron'
import { qsysData } from '..'
import byMethod from './byMethod'

/*
id
3001 = get pa gain mute all

*/

export default function (id, data) {
  // id keys check
  if (Object.keys(qsysData).includes(id) === false) {
    qsysData[id] = {}
  }
  const obj = qsysData[id]

  if (Object.keys(data).includes('method')) {
    byMethod(id, data.method, data.params)
  }
  if (Object.keys(data).includes('id')) {
    switch (data.id) {
      case 3001:
        const arr = data.result.Controls
        arr.forEach((control) => {
          const channel = control.Name.replace(/[^0-9]/g, '')
          if (control.Name.includes('gain')) {
            obj.zones[channel].gain = control.Value
          }
          if (control.Name.includes('mute')) {
            obj.zones[channel].mute = control.Value
          }
        })
        break
    }
  }
  BrowserWindow.fromId(1).webContents.send('qsys:data', qsysData)
}
