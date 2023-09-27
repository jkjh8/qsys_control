import { qsysData } from '..'

export default function (deviceId, data) {
  const { id, result } = data
  switch (id) {
    case 3001:
      const arr = result.Controls
      for (let control of arr) {
        const channel = control.Name.replace(/[^0-9]/g, '')
        if (control.Name.includes('gain')) {
          qsysData[deviceId].zones[channel].gain = control.Value
        }
        if (control.Name.includes('mute')) {
          qsysData[deviceId].zones[channel].mute = control.Value
        }
      }
      break
    default:
      console.log(deviceId, data)
      break
  }
}
