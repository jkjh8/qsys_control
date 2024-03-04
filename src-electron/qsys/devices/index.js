import Qrc from '../qrc'
import { sendQsysConnect, sendQsysDisconnect } from '../socket'
import { setPaFeedback } from '../commands'
import fromQsys from '../fromQsys'

const qsyslist = {}
let qsysArr = []

const addListQsysDevices = (args) => {
  qsysArr = args
  args.forEach((device) => {
    const { deviceId } = device
    if (qsyslist[deviceId] === null || qsyslist[deviceId] === undefined) {
      addlistQsysDevice(device)
    }
    // 리스트에 없는 경우 삭제
    for (let item in qsyslist) {
      if (args.findIndex((e) => e.deviceId === item) === -1) {
        if (qsyslist[item].connected) {
          qsyslist[item].disconnect()
        }
        delete qsyslist[item]
      }
    }
  })
}

const addlistQsysDevice = (device) => {
  const { deviceId, name, ipaddress } = device
  // 연결 중복 체크
  if (qsyslist[deviceId] && qsyslist[deviceId].connected) {
    return logger.warn(`QSYS ${name}: ${deviceId}가 이미 연결되어 있습니다.`)
  }
  // 생성
  qsyslist[deviceId] = new Qrc(device)
  // callback
  qsyslist[deviceId].on('connect', () => {
    sendQsysConnect({ deviceId, name, ipaddress })
    // PA 모듈 호출
    setPaFeedback(deviceId)
  })

  qsyslist[deviceId].on('disconnect', () => {
    sendQsysDisconnect({ deviceId, name, ipaddress })
    reconnect(device)
  })

  qsyslist[deviceId].on('data', (data) => {
    // QSYS DATA
    console.log('qsys data = ', arr)
    // QSYS 데이터 처리
    fromQsys(deviceId, data)
  })

  qsyslist[deviceId].on('error', (error) => {
    logger.error(`qsys error ${deviceId} ${ipaddress} ${error}`)
  })
  // 연결
  qsyslist[deviceId].connect()
}

const reconnect = (device) => {
  setTimeout(() => {
    if (Object.keys(qsyslist).includes(device.deviceId)) {
      addlistQsysDevice(device)
    }
  }, 5000)
}

export { qsyslist, qsysArr, addListQsysDevices, addlistQsysDevice }
