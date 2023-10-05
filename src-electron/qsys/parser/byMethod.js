import { socket } from 'src-electron/socket'
import logger from 'src-electron/logger'

export default function (deviceId, method, params) {
  switch (method) {
    case 'EngineStatus':
      socket.emit(
        'qsys:data',
        JSON.stringify({ deviceId: deviceId, key: 'status', data: params })
      )
      break
    case 'PA.ZoneStatus':
      const obj = {}
      if (Object.keys(obj).includes(params.Zone.toString()) === false) {
        obj[params.Zone] = {}
      }

      for (let key in params) {
        if (key !== 'Zone') {
          obj[params.Zone][key] = params[key]
        }
      }
      return { key: 'zones', data: obj }
      break
    default:
      logger.warn(`parse method default ${method}, ${params}`)
  }
}
