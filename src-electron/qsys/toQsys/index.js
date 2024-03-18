import { qsysObj, qsysArr } from '../devices'
import logger from 'src-electron/logger'

// 1000
const getQsysStatus = (deviceId) => {
  try {
    qsysObj[deviceId].addCommand({ id: 1000, method: 'StatusGet', params: 0 })
  } catch (error) {
    logger.error(`get qsys status -- ${error}`)
  }
}

// 2000
const setQsysPaFeedback = (deviceId, value = true) => {
  try {
    qsysObj[deviceId].addCommand({
      id: 2000,
      method: 'PA.ZoneStatusConfigure',
      params: { Enabled: value }
    })
  } catch (error) {
    logger.error(`set qsys pa feedback -- ${error}`)
  }
}

// 2001
const getQsysPaConfig = (deviceId) => {
  try {
    qsysObj[deviceId].addCommand({
      id: 2001,
      method: 'PA.GetConfig',
      params: {}
    })
  } catch (error) {
    logger.error(`get qsys pa config -- ${error}`)
  }
}

// 2002
const pageQsysMessage = (deviceId, obj) => {
  try {
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
  } catch (error) {
    logger.error(`page qsys message -- ${error}`)
  }
}

// 2003
const pageQsysLive = (deviceId, obj) => {
  try {
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
  } catch (error) {
    logger.error(`page qsys live -- ${error}`)
  }
}

// 2008
const pageQsysStop = (deviceId, PageID) => {
  try {
    qsysObj[deviceId].addCommand({
      id: 2008,
      method: 'PA.PageStop',
      params: { PageID }
    })
  } catch (error) {
    logger.error(`page stop -- ${error}`)
  }
}

// 2008
const pageQsysCancel = (deviceId, PageID) => {
  try {
    qsysObj[deviceId].addCommand({
      id: 2008,
      method: 'PA.PageCancel',
      params: { PageID }
    })
  } catch (error) {
    logger.error(`page cancel -- ${error}`)
  }
}

// 3001
const getQsysGainMute = (deviceId) => {
  try {
    const Controls = []
    const ZoneStatus =
      qsysArr[qsysArr.findIndex((e) => e.deviceId === deviceId)].ZoneStatus
    for (let item of ZoneStatus) {
      Controls.push({ Name: `zone.${item.Zone}.gain` })
      Controls.push({ Name: `zone.${item.Zone}.mute` })
    }
    qsysObj[deviceId].addCommand({
      id: 3001,
      method: 'Component.Get',
      params: { Name: 'PA', Controls }
    })
  } catch (error) {
    logger.error(`get qsys gain mute -- ${error}`)
  }
}

// 3003
const setQsysGain = (deviceId, zone, value) => {
  try {
    qsysArr[qsysArr.findIndex((e) => e.deviceId === deviceId)].ZoneStatus[
      zone - 1
    ].gain = value
    qsysObj[deviceId].addCommand({
      id: 3003,
      method: 'Component.Set',
      params: {
        Name: 'PA',
        Controls: [{ Name: `zone.${zone}.gain`, Value: value }]
      }
    })
  } catch (error) {
    logger.error(`set qsys gain -- ${error}`)
  }
}

const setQsysMute = (deviceId, zone, value) => {
  try {
    qsysArr[qsysArr.findIndex((e) => e.deviceId === deviceId)].ZoneStatus[
      zone - 1
    ].mute = value
    qsysObj[deviceId].addCommand({
      id: 3004,
      method: 'Component.Set',
      params: {
        Name: 'PA',
        Controls: [{ Name: `zone.${zone}.mute`, Value: value }]
      }
    })
  } catch (error) {
    logger.error(`set qsys mute -- ${error}`)
  }
}

const fnSetTransmitters = (deviceId) => {
  const zones =
    qsysArr[qsysArr.findIndex((e) => e.deviceId === deviceId)].ZoneStatus
  for (let zone of zones) {
    const { destination, Zone } = zone
    if (destination && destination.ipaddress) {
      fnSetTransmitter({ deviceId, Zone, ipaddress: destination.ipaddress })
    } else {
      fnSetTransmitter({ deviceId, Zone, ipaddress: '' })
    }
  }
}

const fnSetTransmitter = (args) => {
  console.log(args)
  const { deviceId, zone, ipaddress } = args
  qsysObj[deviceId].addCommand({
    id: 4001,
    method: 'Component.Set',
    params: {
      Name: `Media_Stream_Transmitter_MS-TX-${zone}`,
      Controls: [
        { Name: 'host', Value: ipaddress },
        { Name: 'port', Value: 4444 }
      ]
    }
  })
}

const fnCancelAll = (deviceId) => {
  console.log(deviceId)
  try {
    qsysObj[deviceId].addCommand({
      id: 2010,
      method: 'Component.Set',
      params: {
        Name: 'PA',
        Controls: [{ Name: 'cancel.all.commands', Value: true }]
      }
    })
  } catch (error) {
    logger.error(error)
  }
}

export {
  getQsysStatus,
  setQsysPaFeedback,
  getQsysPaConfig,
  pageQsysMessage,
  pageQsysLive,
  pageQsysStop,
  pageQsysCancel,
  getQsysGainMute,
  setQsysGain,
  setQsysMute,
  fnSetTransmitters,
  fnSetTransmitter,
  fnCancelAll
}
