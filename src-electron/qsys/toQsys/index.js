import { qsysObj, qsysArr } from '../devices'

// 1000
const getQsysStatus = (deviceId) => {
  qsysObj[deviceId].addCommand({ id: 1000, method: 'StatusGet', params: 0 })
}

// 2000
const setQsysPaFeedback = (deviceId, value = true) => {
  qsysObj[deviceId].addCommand({
    id: 2000,
    method: 'PA.ZoneStatusConfigure',
    params: { Enabled: value }
  })
}

// 2001
const getQsysPaConfig = (deviceId) => {
  qsysObj[deviceId].addCommand({ id: 2001, method: 'PA.GetConfig', params: {} })
}

// 2002
const pageQsysMessage = (deviceId, obj) => {
  const params = {
    Mode: 'message',
    Zone: obj.Zones,
    Priority: obj.Priority,
    Message: obj.Message,
    MessageDelete: obj.MessageDelete ? obj.MessageDelete : false,
    QueueTimeout: obj.QueueTimeout ? obj.QueueTimeout : 0,
    CancelDelay: obj.CancelDelay ? obj.CancelDelay : 0
  }
  if (obj.Preamble) {
    params.Preamble = obj.Preamble
  }
  qsysObj[deviceId].addCommand({ id: 2002, method: 'PA.PageSubmit', params })
}

// 2003
const pageQsysLive = (deviceId, obj) => {
  const params = {
    Zones: obj.Zones,
    MaxPageTime: obj.MaxPageTime ? obj.MaxPageTime : 240,
    Mode: 'live',
    Station: 1,
    Priority: obj.Priority ? obj.Priority : 3,
    Start: true
  }
  if (obj.Preamble) {
    params.Preamble = obj.Preamble
  }
  qsysObj[deviceId].addCommand({ id: 2003, method: 'PA.PageSubmit', params })
}

// 2008
const pageQsysStop = (deviceId, PageID) => {
  qsysObj[deviceId].addCommand({
    id: 2008,
    method: 'PA.PageStop',
    params: { PageID }
  })
}

// 2008
const pageQsysCancel = (deviceId, PageID) => {
  qsysObj[deviceId].addCommand({
    id: 2008,
    method: 'PA.PageCancel',
    params: { PageID }
  })
}

// 3001
const getQsysGainMute = (deviceId) => {
  const Controls = []
  const ZoneStatus = qsysArr[qsysArr.findIndex((e) => e.deviceId === deviceId)]
  for (let item of ZoneStatus) {
    Controls.push({ Name: `zone.${item.Zone}.gain` })
    Controls.push({ Name: `zone.${item.Zone}.mute` })
  }
  qsysObj[deviceId].addCommand({
    id: 3001,
    method: 'Component.Get',
    params: { Name: 'PA', Controls }
  })
}

export {
  getQsysStatus,
  setQsysPaFeedback,
  getQsysPaConfig,
  pageQsysMessage,
  pageQsysLive,
  pageQsysStop,
  pageQsysCancel,
  getQsysGainMute
}
