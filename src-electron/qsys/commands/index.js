import { qsys, qsysData } from '..'
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
  const keys = Object.keys(qsysData[deviceId].zones)
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

// function setPaFeedback(deviceId) {}
export { getPaGainMute, setPaFeedback, getStatus, getPaConfig }
