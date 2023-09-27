import { qsysData } from '..'

export default function (deviceId, data) {
  const { id, result } = data
  switch (id) {
    case 2000:
      qsysData[deviceId].ZoneStatusConfigure = data.result
      break
    case 3001:
      const arr = result.Controls
      for (let control of arr) {
        const channel = control.Name.replace(/[^0-9]/g, '')
        if (control.Name.includes('gain')) {
          qsysData[deviceId].zones[channel].Gain = control.Value
        }
        if (control.Name.includes('mute')) {
          qsysData[deviceId].zones[channel].Mute = control.Value
        }
      }
      break
    default:
      console.log(deviceId, data)
      break
  }
}
