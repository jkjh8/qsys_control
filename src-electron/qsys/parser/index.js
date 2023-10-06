import { getPaGainMute } from '../commands'
import byMethod from './byMethod'
import byId from './byId'
import { socket } from 'src-electron/socket'
import { qsys } from '..'
/*
id
3001 = get pa gain mute all

*/

export default function (deviceId, rt) {
  let zones = {}
  for (let val of rt) {
    if (val) {
      const data = JSON.parse(val)
      // by method
      if (Object.keys(data).includes('method')) {
        byMethod(deviceId, data.method, data.params)
      }
      // by id
      if (Object.keys(data).includes('id')) {
        byId(deviceId, data)
      }
    }
  }
  socket.emit(
    'qsys:data',
    JSON.stringify({
      deviceId,
      status: qsys[deviceId].status,
      zones: qsys[deviceId].zones,
      ZoneStatusConfigure: qsys[deviceId].ZoneStatusConfigure
    })
  )
  // getPaGainMute(deviceId, zones)
}
