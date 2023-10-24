import { qsysData } from 'src-electron/qsys'

let devices

function updateDevices(args) {
  for (let i = 0; i < args.length; i++) {
    if (Object.keys(qsysData).includes(args[i].deviceId)) {
      qsysData[args[i].deviceId].ZoneStatus = args[i].ZoneStatus
    } else {
      qsysData[args[i].deviceId] = {
        EngineStatus: {},
        PageStatus: {},
        PaConfig: {},
        PageID: null,
        ZoneStatusConfigure: false,
        ZoneStatus: args[i].ZoneStatus
      }
    }
  }
  devices = args
}

export { devices, updateDevices }
