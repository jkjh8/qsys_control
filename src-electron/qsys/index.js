import Qrc from './qrc'
import logger from '../logger'
import { socket } from '../socket'
import qsysParser from './parser'
import { getPaGainMute, setPaFeedback } from './commands'

const qsys = {}
const qsysData = {}

function addQsys(devices) {
  devices.forEach((device) => {
    if (
      qsys[device.deviceId] === null ||
      qsys[device.deviceId] === undefined ||
      qsys[device.deviceId].connected === false
    ) {
      addQsysDevice(device)
    }
  })
}

function addQsysDevice(device) {
  try {
    const { deviceId, name, ipaddress } = device
    if (qsys[deviceId] && qsys[deviceId].connected)
      return logger.warn(`qsys device ${name} ${deviceId} exists`)
    qsys[deviceId] = new Qrc(device)

    qsys[deviceId].on('connect', () => {
      logger.info(`qsys ${name} - ${ipaddress} - ${deviceId} connected!`)
      socket.emit(
        'qsys',
        JSON.stringify({
          key: 'connect',
          deviceId,
          name,
          ipaddress,
          value: 'OK'
        })
      )
      initQsysData(deviceId)
    })

    qsys[deviceId].on('disconnect', () => {
      logger.warn(`qsys ${name} - ${ipaddress} disconnected`)
      socket.emit(
        'qsys',
        JSON.stringify({
          key: 'disconnect',
          deviceId,
          name,
          ipaddress,
          value: 'OK'
        })
      )
      reconnectDevice(device)
    })

    qsys[deviceId].on('data', (arr) => {
      logger.info(`qsys data on ${name} ${ipaddress} ${deviceId}`)
      qsysParser(deviceId, arr)
    })

    qsys[deviceId].on('error', (err) => {
      logger.error(`qsys error on ${name} ${ipaddress} ${deviceId} -- ${err}`)
    })
    qsys[deviceId].connect()
  } catch (err) {
    logger.error(`qsys device add error -- ${err}`)
  }
}

function reconnectDevice(device) {
  setTimeout(() => {
    addQsysDevice(device)
  }, 60000)
}

function initQsysData(deviceId) {
  qsysData[deviceId] = {
    EngineStatus: {},
    ZoneStatus: {},
    PageStatus: {},
    PaConfig: {},
    PageID: null,
    ZoneStatusConfigure: false
  }

  setTimeout(() => {
    setPaFeedback(deviceId)
  }, 1000)
}

function removeQsys(device) {
  try {
    delete qsys[device.deviceId]
    delete qsysData[device.deviceId]
    logger.warn(`qsys ${device.name} - ${device.ipaddress} removed`)
  } catch (err) {
    logger.error(
      `qsys ${device.name} - ${device.ipaddress} remove error -- ${err}`
    )
  }
}

export { qsys, qsysData, addQsys }
