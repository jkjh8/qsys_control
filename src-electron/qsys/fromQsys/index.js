import { qsyslist, qsysArr } from '../devices'
import {
  ioSendEngineStatus,
  ioSendZoneStatus,
  ioSendZoneStatusConfigure,
  ioSendPaConfig,
  ioSendPageMessage,
  ioSendPageLive,
  ioSendPageStop,
  ioSendPageCancel
} from '../socket'

export default function parser(deviceId, data) {
  for (let obj of data) {
    // by method
    if (Object.keys(obj).includes('method')) {
      const { method, params } = obj
      switch (method) {
        case 'EngineStatus':
          ioSendEngineStatus({ deviceId, EngineStatus: params })
          break
        // PA.ZoneStatus 코딩 필요.
        case 'PA.ZoneStatus':
          const ZoneStatus =
            qsysArr[qsysArr.findIndex((e) => e.deviceId === deviceId)]
              .ZoneStatus
          const idx = ZoneStatus.findIndex((e) => e.Zone === params.Zone)
          if (idx !== -1) {
            for (let key in params) {
              ZoneStatus[idx][key] = params[key]
            }
          } else {
            ZoneStatus.push(params)
          }
          break
      }
    }
    // by ID
    /*
    2000 = ZoneStatusConfigure
    2001 = get pa configure
    2000 = set Pa Feedback
    2001 = get pa config
    2002 = message page
    2003 = live page
    2008 = stop page
    2009 = cancel page
    3001 = get pa gain mute all
    */
    if (Object.keys(obj).includes('id')) {
      const { id, result } = obj
      switch (id) {
        case '1000':
          ioSendEngineStatus({ deviceId, EngineStatus: result })
          break
        case '2000':
          ioSendZoneStatusConfigure({ deviceId, ZoneStatusConfigure: result })
          break
        case '2001':
          ioSendPaConfig({ deviceId, PaConfig: result })
          break
        case '2002':
          ioSendPageMessage({ deviceId, ...result })
          break
        case '2003':
          ioSendPageLive({ deviceId, ...result })
          break
        case '2008':
          ioSendPageStop({ deviceId })
          break
        case '2009':
          ioSendPageCancel({ deviceId })
          break
        case '3001':
          // volume and mute
          break
      }
    }
  }
  ioSendZoneStatus({
    deviceId,
    ZoneStatus:
      qsysArr[qsysArr.findIndex((e) => e.deviceId === deviceId)].ZoneStatus
  })
}
