import { socket } from 'src-electron/socket'
import { qsys, qsysData } from '..'
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
          qsysData[deviceId].EngineStatus = params
          break
        case 'PA.ZoneStatus':
          const zones = qsysData[deviceId].ZoneStatus
          if (Object.keys(zones).includes(params.Zone.toString()) === false) {
            zones[params.Zone] = {}
          }
          for (let key in params) {
            if (key !== 'Zone') {
              zones[params.Zone][key] = params[key]
            }
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
          qsysData[deviceId].EngineStatus = result
          sendSocket(deviceId, 'EngineStatus', { value: result })
          break
        // 2000 set pa feedback
        case 2000:
          qsysData[deviceId].ZoneStatusConfigure = result
          sendSocket(deviceId, 'ZoneStatusConfigure', { value: result })
          break
        //2001 get pa configure
        case 2001:
          // TODO: add qsysData ???
          qsysData[deviceId].PaConfig = result
          sendSocket(deviceId, 'PaConfig', { value: result })
          break
        // 2002 page message
        case 2002:
          qsysData[deviceId].PageID = result.PageID
          sendSocket(deviceId, 'page:message', result)
          break
        // 2003 live page
        case 2003:
          qsysData[deviceId].PageID = result.PageID
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
          for (let control of arr) {
            const channel = control.Name.replace(/[^0-9]/g, '')
            if (control.Name.includes('gain')) {
              qsysData[deviceId].ZoneStatus[channel].gain = control.Value
            }
            if (control.Name.includes('mute')) {
              qsysData[deviceId].ZoneStatus[channel].mute = control.Value
            }
          }
          sendSocket(deviceId, 'GainAndMute', {
            ZoneStatus: qsysData[deviceId].ZoneStatus
          })
          break
      }
    }
  }
  // if rt true return socket to qsys data
  if (rt) {
    sendSocket(deviceId, 'RtByMethod', {
      EngineStatus: qsysData[deviceId].EngineStatus,
      ZoneStatus: qsysData[deviceId].ZoneStatus
    })
  }
}

function sendSocket(deviceId, key, value) {
  socket.emit('qsys', JSON.stringify({ key: key, deviceId, ...value }))
}
