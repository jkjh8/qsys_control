import { qsys, qsysData } from '..'
/*
id
2000 = set Pa feedback
3001 = get pa gain mute all

*/

// 3001
function getPaGainMute(deviceId, zones) {
  const arr = []
  const keys = Object.keys(zones)
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
// 3000
function getStatus(deviceId) {
  qsys[deviceId].addCommand({
    id: 3000,
    method: 'StatusGet',
    params: 0
  })
}

// 2005
function getPaConfig(deviceId) {
  qsys[deviceId].addCommand({
    id: 2005,
    method: 'PA.GetConfig',
    params: {}
  })
}

// function setPaFeedback(deviceId) {}
export { getPaGainMute, setPaFeedback, getStatus, getPaConfig }
