import { qsys, qsysData } from '..'
/*
id
3001 = get pa gain mute all

*/
function getPaGainMute(deviceId) {
  const arr = []
  if (qsysData[deviceId] && qsysData[deviceId].zones) {
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
}

export { getPaGainMute }
