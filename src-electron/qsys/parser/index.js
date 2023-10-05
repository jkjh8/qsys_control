import { getPaGainMute } from '../commands'
import byMethod from './byMethod'
import byId from './byId'
import { socket } from 'src-electron/socket'
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
        const r = byMethod(deviceId, data.method, data.params)
        if (r && r.key === 'zones') {
          zones = { ...zones, ...r.data }
        }
      }
      // by id
      if (Object.keys(data).includes('id')) {
        byId(deviceId, data)
      }
    }
  }
  if (Object.keys(zones).length > 0) {
    socket.emit(
      'qsys:data',
      JSON.stringify({ deviceId, key: 'zones', data: zones })
    )
    getPaGainMute(deviceId, zones)
  }
}
