import { socket } from 'src-electron/socket'
import { qsys } from '..'
export default function (deviceId, data) {
  const { id, result } = data
  switch (id) {
    // 2000 set pa feedback
    case 2000:
      qsys[deviceId].ZoneStatusConfigure = result
      break
    // 3001 gain and mute
    case 3001:
      const arr = result.Controls
      console.log(arr)
      let gain = {}
      let mute = {}
      for (let control of arr) {
        const channel = control.Name.replace(/[^0-9]/g, '')
        if (control.Name.includes('gain')) {
          gain[channel] = control.Value
        }
        if (control.Name.includes('mute')) {
          mute[channel] = control.Value
        }
      }
      socket.emit(
        'qsys:data',
        JSON.stringify({ deviceId, key: 'gainAndMute', gain, mute })
      )
      break
    // 3000 status
    case 3000:
      socket.emit(
        'qsys:data',
        JSON.stringify({ deviceId, key: 'status', data: result })
      )
      break
    case 2005:
      socket.emit(
        'qsys:data',
        JSON.stringify({ deviceId, key: 'PaConfig', data: result })
      )
      break
    default:
      console.log(deviceId, data)
      break
  }
}
