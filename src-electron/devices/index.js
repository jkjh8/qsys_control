import { qsysData } from 'src-electron/qsys'

let devices

function updateDevices(args) {
  return new Promise((resolve, reject) => {
    try {
      for (let i = 0; i < args.length; i++) {
        if (Object.keys(qsysData).includes(args[i].deviceId)) {
          qsysData[args[i].deviceId].ZoneStatus = args[i].ZoneStatus
        } else {
          qsysData[args[i].deviceId] = {
            EngineStatus: args[i].EngineStatus,
            PageStatus: args[i].PageStatus,
            PaConfig: args[i].PaConfig,
            PageID: null,
            ZoneStatusConfigure: false,
            ZoneStatus: args[i].ZoneStatus
          }
        }
      }
      devices = args
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

export { devices, updateDevices }
