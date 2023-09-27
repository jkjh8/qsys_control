import Qrc from './qrc'
import logger from '../logger'
import { socket } from '../socket'
import qsysParser from './parser'
import { getPaGainMute } from './commands'

const qsys = {}
const qsysData = {}

let id = 1000

function getId() {
  if (id < 2000) return (id = id + 1)
  return (id = 1001)
}

function addQsys(devices) {
  devices.forEach((device) => {
    const { deviceId, name, ipaddress } = device
    // obj exists check
    if (qsys[deviceId]) return
    // function connect
    try {
      qsys[deviceId] = new Qrc(device)
      qsys[deviceId].on('connect', () => {
        // send socket
        logger.info(`qsys ${name} - ${ipaddress} connected`)
        socket.emit('data', { command: 'connect', value: device })

        setPaFeedback(device)
        setTimeout(() => {
          try {
            getPaGainMute(device.deviceId)
          } catch (error) {
            console.log(error)
          }
        }, 1000)
      })
      qsys[deviceId].on('disconnect', () => {
        // send socket
        socket.emit('data', { command: 'disconnect', value: device })
        logger.warn(`qsys ${name} - ${ipaddress} disconnected`)
      })
      // on data
      qsys[deviceId].on('data', (arr) => {
        console.log(`on data ${deviceId}`)
        qsysParser(deviceId, arr)
        // arr.forEach((device) => {
        //   if (device) {
        //     qsysParser(deviceId, JSON.parse(device))
        //   }
        // })
      })
      qsys[deviceId].on('error', (err) => {
        logger.error(err)
      })
      qsys[device.deviceId].connect()
    } catch (err) {
      logger.error(
        `qsys ${device.name} - ${device.ipaddress} add error -- ${err}`
      )
    }
  })
}

function removeQsys(device) {
  try {
    delete qsys[device.deviceId]
    logger.warn(`qsys ${device.name} - ${device.ipaddress} removed`)
  } catch (err) {
    logger.error(
      `qsys ${device.name} - ${device.ipaddress} remove error -- ${err}`
    )
  }
}

// code 2000, set Pa feed back
function setPaFeedback(device, value = true) {
  try {
    qsys[device.deviceId].addCommand({
      id: 2000,
      method: 'PA.ZoneStatusConfigure',
      params: { Enabled: value }
    })
  } catch (err) {
    logger.error(
      `qsys ${device.name} - ${device.ipaddress} set PA feedback error -- ${err}`
    )
  }
}

function defaultPlay(device, obj) {
  const { deviceId, name, ipaddress } = device
  try {
    // TODO: if need relay on code?
    const {
      mode,
      zones,
      station,
      priority,
      description,
      preamble,
      cancelDelay,
      queueTimeout
    } = obj
    // default set command
    const command = {
      id: 2001,
      Mode: mode ? mode : 'auto',
      Zones: zones,
      Station: station ? station : 1,
      Priority: priority ? priority : 3,
      QueueTimeout: queueTimeout ? queueTimeout : 240,
      CancelDelay: cancelDelay ? cancelDelay : 0
    }
    // add description
    if (description) {
      command.description = description
    }
    // add preamble
    if (preamble) {
      command.preamble = preamble
    }
    // add command to qsys
    qsys[deviceId].addCommand(command)
  } catch (err) {
    logger.error(`qsys ${name} - ${ipaddress} message play error -- ${err}`)
  }
}

// code 2001, message play
function messagePlay(device, obj) {
  const { deviceId, name, ipaddress } = device
  try {
    // TODO: if need relay on code?
    const {
      zones,
      priority,
      message,
      messageDelete,
      description,
      preamble,
      cancelDelay,
      queueTimeout
    } = obj
    // default set command
    const command = {
      id: 2001,
      Mode: 'message',
      Zones: zones,
      Priority: priority,
      Message: message,
      MessageDelete: messageDelete ? messageDelete : false,
      QueueTimeout: queueTimeout ? queueTimeout : 0,
      CancelDelay: cancelDelay ? cancelDelay : 0
    }
    // add description
    if (description) {
      command.description = description
    }
    // add preamble
    if (preamble) {
      command.preamble = preamble
    }
    // add command to qsys
    qsys[deviceId].addCommand(command)
  } catch (err) {
    logger.error(`qsys ${name} - ${ipaddress} message play error -- ${err}`)
  }
}
function qsysCommand(device, method, params) {
  const { deviceId, name, ipaddress } = device
  try {
    qsys[deviceId].addCommand({
      id: getId(),
      method,
      params
    })
  } catch (err) {
    logger.error(`qsys ${name} - ${ipaddress} command error -- ${err}`)
  }
}

export {
  qsys,
  qsysData,
  addQsys,
  removeQsys,
  setPaFeedback,
  messagePlay,
  defaultPlay,
  qsysCommand
}
