import { socket } from 'src-electron/socket'
import { qsys, devices } from '..'
import { getPaGainMute } from '../commands'
/*
id
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

export default function (deviceId, data) {
  let rt = false
  console.log(data)
  for (let obj of data) {
    // by method
    if (Object.keys(obj).includes('method')) {
      const { method, params } = obj
      switch (method) {
        case 'EngineStatus':
          // qsysData[deviceId].EngineStatus = params
          sendSocket(deviceId, 'EnginStatus', { EngineStatus: params })
          break
        case 'PA.ZoneStatus':
          // TODO: zone data object to array change!!!
          const ZoneStatus =
            devices[devices.findIndex((e) => e.deviceId === deviceId)]
              .ZoneStatus
          let idx = ZoneStatus.findIndex((e) => e.Zone === params.Zone)
          if (idx !== -1) {
            for (let key in params) {
              ZoneStatus[idx][key] = params[key]
            }
          } else {
            ZoneStatus.push(params)
          }
          rt = true
          break
      }
    }

    // by id
    if (Object.keys(obj).includes('id')) {
      const { id, result } = obj
      switch (id) {
        // 1000 get device status
        case 1000:
          sendSocket(deviceId, 'EngineStatus', { EngineStatus: result })
          break
        // 2000 set pa feedback
        case 2000:
          sendSocket(deviceId, 'ZoneStatusConfigure', { value: result })
          break
        //2001 get pa configure
        case 2001:
          // TODO: add qsysData ???
          sendSocket(deviceId, 'PaConfig', { value: result })
          break
        // 2002 page message
        case 2002:
          sendSocket(deviceId, 'page:message', result)
          break
        // 2003 live page
        case 2003:
          sendSocket(deviceId, 'page:live', result)
          break
        // 2008 page stop
        case 2008:
          sendSocket(deviceId, 'page:stop', { value: result })
          break
        // 2008 page stop
        case 2009:
          sendSocket(deviceId, 'page:cancel', { value: result })
          break
        // 3001 get gain and mute
        case 3001:
          const arr = result.Controls
          const ZoneStatus =
            devices[devices.findIndex((e) => e.deviceId === deviceId)]
              .ZoneStatus
          for (let control of arr) {
            const channel = Number(control.Name.replace(/[^0-9]/g, ''))
            if (control.Name.includes('gain')) {
              let idx = ZoneStatus.findIndex((e) => e.Zone === channel)
              ZoneStatus[idx].gain = control.Value
            }
            if (control.Name.includes('mute')) {
              let idx = ZoneStatus.findIndex((e) => e.Zone === channel)
              ZoneStatus[idx].mute = control.Value
            }
          }
          sendSocket(deviceId, 'GainAndMute', { ZoneStatus })
          break
        case 3002:
        case 3003:
          if (obj.error) {
            getPaGainMute(deviceId)
          }
          break
      }
    }
  }
  // if rt true return socket to qsys data
  if (rt) {
    sendSocket(deviceId, 'ZoneStatus', {
      ZoneStatus:
        devices[devices.findIndex((e) => e.deviceId === deviceId)].ZoneStatus
    })
  }
}

function sendSocket(deviceId, key, value) {
  socket.emit('qsys', JSON.stringify({ key: key, deviceId, ...value }))
}
