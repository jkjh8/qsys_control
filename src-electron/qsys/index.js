// import Qrc from './qrc'
// import logger from '../logger'
// import commands from './functions'
// import { getPaGainMute, setPaFeedback } from './commands'

// const qsys = {}
// let devices = {}

// function addQsysDevices(args) {
//   args.forEach((device) => {
//     const { deviceId } = device
//     if (qsys[deviceId] === null || qsys[deviceId] === undefined) {
//       addQsysDevice(device)
//     }
//     // if (qsys[deviceId].connected === false) {
//     //   qsys[deviceId].connect()
//     // }
//   })

//   for (let item in qsys) {
//     if (args.findIndex((e) => e.deviceId === item) === -1) {
//       if (qsys[item].connected) {
//         qsys[item].disconnected()
//       }
//       delete qsys[item]
//     }
//   }
// }

// function addQsysDevice(device) {
//   try {
//     const { deviceId, name, ipaddress } = device
//     if (qsys[deviceId] && qsys[deviceId].connected)
//       return logger.warn(`qsys device ${name} ${deviceId} exists`)
//     qsys[deviceId] = new Qrc(device)

//     qsys[deviceId].on('connect', () => {
//       logger.info(`qsys ${name} - ${ipaddress} - ${deviceId} connected!`)
//       // qsys connect feedback
//       tcpSocketWrite({
//         comm: 'qsys:connect',
//         deviceId,
//         name,
//         ipaddress,
//         value: 'OK'
//       })
//       initQsysData(deviceId)
//     })

//     qsys[deviceId].on('disconnect', () => {
//       logger.warn(`qsys ${name} - ${ipaddress} disconnected`)
//       // qsys disconnect feedback
//       tcpSocketWrite({
//         comm: 'qsys:disconnect',
//         deviceId,
//         name,
//         ipaddress,
//         value: 'OK'
//       })
//       reconnectDevice(device)
//     })

//     qsys[deviceId].on('data', (arr) => {
//       logger.info(`qsys data on ${name} ${ipaddress} ${deviceId}`)
//       commands(deviceId, arr)
//     })

//     qsys[deviceId].on('error', (err) => {
//       logger.error(`qsys error on ${name} ${ipaddress} ${deviceId} -- ${err}`)
//     })
//     qsys[deviceId].connect()
//   } catch (err) {
//     logger.error(`qsys device add error -- ${err}`)
//   }
// }

// function reconnectDevice(device) {
//   setTimeout(() => {
//     if (Object.keys(qsys).includes(device.deviceId)) {
//       addQsysDevice(device)
//     }
//   }, 60000)
// }

// function initQsysData(deviceId) {
//   setTimeout(() => {
//     setPaFeedback(deviceId)
//   }, 1000)
// }

// // function removeQsys(device) {
// //   try {
// //     delete qsys[device.deviceId]
// //     delete devices[device.deviceId]
// //     logger.warn(`qsys ${device.name} - ${device.ipaddress} removed`)
// //   } catch (err) {
// //     logger.error(
// //       `qsys ${device.name} - ${device.ipaddress} remove error -- ${err}`
// //     )
// //   }
// // }

// // function updateDevices(args) {
// //   devices = args
// //   addQsysDevices(devices)
// // }

// // function updateDevice(args) {
// //   const { deviceId } = args
// //   devices[devices.findIndex((e) => e.deviceId === deviceId)] = args
// // }
// export { qsys, devices, addQsysDevices }
