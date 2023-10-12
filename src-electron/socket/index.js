import { io } from 'socket.io-client'
import logger from 'src-electron/logger'
import { rtIPC } from 'src-electron/ipc'
import { addQsys } from 'src-electron/qsys'
import { updateDevices } from 'src-electron/devices'

let socket

async function socketConnect(addr, uid) {
  try {
    socket = io(`http://${addr}`, {
      transports: ['websocket'],
      rejectUnauthorized: false,
      withCredentials: true,
      auth: {
        token: uid
      },
      extraHeaders: { deviceid: uid, type: 'qsys' },
      autoConnect: true
    })

    socket.on('connect', () => {
      rtIPC('socket:rt', { name: 'online', value: true })
      logger.info(`socket.io connected to ${addr} socket -- ${socket.id}`)
    })

    socket.on('disconnect', (reason) => {
      rtIPC('socket:rt', { name: 'online', value: false })
      logger.warn(`socket.io disconnected from ${addr} socket -- ${reason}`)
      setTimeout(() => {
        socket.connect()
      }, 5000)
    })

    socket.on('qsys:data', (data) => {
      try {
        const obj = JSON.parse(data)
        switch (obj.key) {
          case 'connect':
            updateDevices(obj.value)
            rtIPC('socket:rt', { name: 'devices', value: obj.value })
            addQsys(obj.value)
            break
          case 'devices':
            updateDevices(obj.value)
            rtIPC('socket:rt', { name: 'devices', value: obj.value })
            break
        }
      } catch (err) {
        logger.error(`socket.io data error -- ${err}`)
      }
    })
    logger.info(`socket.io start on -- ${addr} - ${uid}`)
  } catch (err) {
    logger.error(`socket connection error -- ${err}`)
  }
}

export { socket, socketConnect }
