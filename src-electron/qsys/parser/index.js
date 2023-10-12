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
          socket.emit(
            'qsys:data',
            JSON.stringify({ deviceId, key: 'EngineStatus', value: result })
          )
          break
        // 2000 set pa feedback
        case 2000:
          qsysData[deviceId].ZoneStatusConfigure = result
          socket.emit(
            'qsys:data',
            JSON.stringify({
              deviceId,
              key: 'ZoneStatusConfigure',
              value: result
            })
          )
          break
        //2001 get pa configure
        case 2001:
          // TODO: add qsysData ???
          qsysData[deviceId].PaConfig = result
          socket.emit(
            'qsys:data',
            JSON.stringify({ deviceId, key: 'PaConfig', value: result })
          )
          break
        // 2002 page message
        case 2002:
          qsysData[deviceId].PageID = result.PageID
          socket.emit(
            'qsys:data',
            JSON.stringify({
              key: 'page:message',
              value: result
            })
          )
          break
        // 2003 live page
        case 2003:
          qsysData[deviceId].PageID = result.PageID
          socket.emit(
            'qsys:data',
            JSON.stringify({
              key: 'page:live',
              value: result
            })
          )
          break
        // 2008 page stop
        case 2008:
          socket.emit(
            'qsys:data',
            JSON.stringify({ key: 'page:stop', value: result })
          )
          break
        // 2008 page stop
        case 2009:
          socket.emit(
            'qsys:data',
            JSON.stringify({ key: 'page:cancel', value: result })
          )
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
          socket.emit(
            'qsys:data',
            JSON.stringify({
              deviceId,
              key: 'GainAndMute',
              value: qsysData[deviceId].ZoneStatus
            })
          )
      }
    }
  }
  // if rt true return socket to qsys data
  if (rt) {
    socket.emit(
      'qsys:data',
      JSON.stringify({
        key: 'RtByMethod',
        deviceId,
        EngineStatus: qsysData[deviceId].EngineStatus,
        ZoneStatus: qsysData[deviceId].ZoneStatus
      })
    )
  }
  // for (let val of rt) {
  //   if (val) {
  //     const data = JSON.parse(val)
  //     // by method
  //     if (Object.keys(data).includes('method')) {
  //       byMethod(deviceId, data.method, data.params)
  //     }
  //     // by id
  //     if (Object.keys(data).includes('id')) {
  //       byId(deviceId, data)
  //     }
  //   }
  // }
  // socket.emit(
  //   'qsys:data',
  //   JSON.stringify({
  //     deviceId,
  //     status: qsys[deviceId].status,
  //     zones: qsys[deviceId].zones,
  //     ZoneStatusConfigure: qsys[deviceId].ZoneStatusConfigure
  //   })
  // )
  // getPaGainMute(deviceId, zones)
}
