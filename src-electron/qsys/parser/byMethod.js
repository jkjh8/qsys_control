import { socket } from 'src-electron/socket'
import { qsys } from '..'
import logger from 'src-electron/logger'

export default function (deviceId, method, params) {
  switch (method) {
    case 'EngineStatus':
      qsys[deviceId].status = params
      socket.emit(
        'qsys:data',
        JSON.stringify({ deviceId: deviceId, key: 'status', data: params })
      )
      break
    case 'PA.ZoneStatus':
      if (Object.keys(qsys[deviceId]).includes('zones') === false) {
        qsys[deviceId].zones = {}
        console.log('make zones obj')
      }

      const obj = qsys[deviceId].zones
      if (Object.keys(obj).includes(params.Zone.toString()) === false) {
        obj[params.Zone] = {}
      }

      for (let key in params) {
        if (key !== 'Zone') {
          obj[params.Zone][key] = params[key]
        }
      }
      break
    default:
      logger.warn(`parse method default ${method}, ${params}`)
  }
}
