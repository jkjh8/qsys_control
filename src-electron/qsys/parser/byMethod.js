import { qsysData } from '..'

export default function (id, method, params) {
  const obj = qsysData[id]
  switch (method) {
    case 'EngineStatus':
      Object.assign(obj, params)
      break
    case 'PA.ZoneStatus':
      if (Object.keys(obj).includes('zones') === false) {
        obj.zones = {}
      }
      if (Object.keys(obj.zones).includes(params.Zone.toString()) === false) {
        obj.zones[params.Zone] = {}
      }

      for (let key in params) {
        if (key !== 'Zone') {
          obj.zones[params.Zone][key] = params[key]
        }
      }
      break
    default:
      console.log('parse method default', method, params)
  }
}
