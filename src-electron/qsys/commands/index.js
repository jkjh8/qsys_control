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
    const command = {
      id: 2002,
      Mode: 'message',
      Zones: obj.zones,
      Priority: obj.priority,
      Message: obj.message,
      MessageDelete: obj.messageDelete ? obj.messageDelete : false,
      QueueTimeout: obj.queueTimeout ? obj.queueTimeout : 0,
      CancelDelay: obj.cancelDelay ? obj.cancelDelay : 0
    }

    if (obj.description) {
      command.description = description
    }

    if (obj.preamble) {
      command.preamble = obj.preamble
    }

    qsys[deviceId].addCommand(command)
  } catch (err) {
    logger.error(`qsys id ${deviceId} default play error: ${err}`)
  }
}

// function setPaFeedback(deviceId) {}
export { getPaGainMute, setPaFeedback, getStatus, getPaConfig, messagePlay }
