import Qrc from '../qrc'
import { sendQsysConnect, sendQsysDisconnect } from '../socket'
import { setPaFeedback } from '../commands'
import fromQsys from '../fromQsys'
import logger from '../../logger'
import { rtIPC } from 'src-electron/ipc'

const qsysObj = {}
let qsysArr = []

const addListQsysDevices = (args) => {
  try {
    qsysArr = args
    args.forEach((device) => {
      const { deviceId } = device
      if (qsysObj[deviceId] === null || qsysObj[deviceId] === undefined) {
        addlistQsysDevice(device)
      }
    })
    // 리스트에 없는 경우 삭제
    for (let deviceId in qsysObj) {
      if (args.findIndex((e) => e.deviceId === deviceId) === -1) {
        qsysObj[deviceId].disconnect()
        delete qsysObj[deviceId]
        console.log('disconnect', deviceId)
      }
    }
  } catch (error) {
    logger.error('addListQsysDevices', error)
  }
}

const addlistQsysDevice = (device) => {
  try {
    const { deviceId, name, ipaddress, connected } = device
    // 연결 중복 체크
    if (qsysObj[deviceId] && qsysObj[deviceId].connected) {
      if (!connected) {
        sendQsysConnect({ deviceId, name, ipaddress })
      }
      return logger.warn(`QSYS ${name}: ${deviceId}가 이미 연결되어 있습니다.`)
    }
    // 생성
    qsysObj[deviceId] = new Qrc(device)
    // callback
    qsysObj[deviceId].on('connect', () => {
      qsysObj[deviceId].connected = true
      sendQsysConnect({ deviceId, name, ipaddress })
      // PA 모듈 호출
      setPaFeedback(deviceId)
    })

    qsysObj[deviceId].on('disconnect', () => {
      sendQsysDisconnect({ deviceId, name, ipaddress })
    })

    qsysObj[deviceId].on('data', (data) => {
      // QSYS DATA
      console.log('qsys data = ', data)
      // QSYS 데이터 처리
      fromQsys(deviceId, data)
    })

    qsysObj[deviceId].on('error', (error) => {
      logger.error(`qsys error ${deviceId} ${ipaddress} ${error}`)
    })
    // 연결
    qsysObj[deviceId].connect()
  } catch (error) {
    logger.error(error)
  }
}

export { qsysObj, qsysArr, addListQsysDevices, addlistQsysDevice }
