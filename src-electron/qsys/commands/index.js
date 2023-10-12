import { qsys, qsysData } from '..'
import logger from 'src-electron/logger'
/*
id
2000 = set Pa feedback
3001 = get pa gain mute all

*/

// 1000
function getStatus(deviceId) {
  qsys[deviceId].addCommand({
    id: 1000,
    method: 'StatusGet',
    params: 0
  })
}

// 3001
function getPaGainMute(deviceId) {
  const arr = []
  const keys = Object.keys(qsysData[deviceId].ZoneStatus)
  for (let key of keys) {
    arr.push({ Name: `zone.${key}.gain` })
    arr.push({ Name: `zone.${key}.mute` })
  }
  qsys[deviceId].addCommand({
    id: 3001,
    method: 'Component.Get',
    params: {
      Name: 'PA',
      Controls: arr
    }
  })
}
// 2000
function setPaFeedback(deviceId, value = true) {
  qsys[deviceId].addCommand({
    id: 2000,
    method: 'PA.ZoneStatusConfigure',
    params: { Enabled: value }
  })
}

// 2001
function getPaConfig(deviceId) {
  qsys[deviceId].addCommand({
    id: 2001,
    method: 'PA.GetConfig',
    params: {}
  })
}

// 2002
function messagePlay(deviceId, obj) {
  try {
    const params = {
      Mode: 'message',
      Zones: obj.Zones,
      Priority: obj.Priority,
      Message: obj.Message,
      MessageDelete: obj.MessageDelete ? obj.MessageDelete : false,
      QueueTimeout: obj.QueueTimeout ? obj.QueueTimeout : 0,
      CancelDelay: obj.CancelDelay ? obj.CancelDelay : 0
    }

    if (obj.Description) {
      params.Description = Description
    }

    if (obj.Preamble) {
      params.Preamble = obj.Preamble
    }

    qsys[deviceId].addCommand({ id: 2002, method: 'PA.PageSubmit', params })
  } catch (err) {
    logger.error(`qsys id ${deviceId} message page error: ${err}`)
  }
}

// 2003
function livePage(deviceId, obj) {
  try {
    const params = {
      Zones: obj.Zones,
      MaxPageTime: obj.MaxPageTime ? obj.MaxPageTime : 240,
      Mode: 'live',
      Station: 1,
      Priority: obj.Priority ? obj.Priority : 3,
      Start: true
    }
    if (obj.Description) {
      params.Description = Description
    }
    if (obj.Preamble) {
      params.Preamble = obj.Preamble
    }

    qsys[deviceId].addCommand({ id: 2003, method: 'PA.PageSubmit', params })
  } catch (err) {
    logger.error(`qsys id ${deviceId} live page error ${err}`)
  }
}
// 2008
function stopPage(deviceId, PageID) {
  try {
    qsys[deviceId].addCommand({
      id: 2009,
      method: 'PA.PageStop',
      params: { PageID }
    })
  } catch (err) {
    logger.error(`qsys id ${deviceId} page stop error ${err}`)
  }
}
// 2009
function cancelPage(deviceId, PageID) {
  try {
    qsys[deviceId].addCommand({
      id: 2009,
      method: 'PA.PageCancel',
      params: { PageID }
    })
  } catch (err) {
    logger.error(`qsys id ${deviceId} page cancel error ${err}`)
  }
}
// function setPaFeedback(deviceId) {}
export {
  getPaGainMute,
  setPaFeedback,
  getStatus,
  getPaConfig,
  messagePlay,
  livePage,
  stopPage,
  cancelPage
}
