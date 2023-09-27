import { io } from 'socket.io-client'
import logger from 'src-electron/logger'
import { rtIPC } from 'src-electron/ipc'
import dataProcess from './dataProcess'
import { qsysData } from 'src-electron/qsys'

let socket

async function socketConnect(addr, uid) {
  try {
    socket = io(`http://${addr}/qsys`, {
      transports: ['websocket'],
      withCredentials: true,
      rejectUnauthorized: false,
      extraHeaders: { deviceid: uid, type: 'qsys' },
      autoConnect: true
    })

    socket.on('connect', () => {
      rtIPC('socket:rt', { name: 'online', value: true })
      socket.emit('qsys:data', JSON.stringify(qsysData))
      logger.info(`socket.io connected to ${addr} socket -- ${socket.id}`)
    })

    socket.on('disconnect', (reason) => {
      rtIPC('socket:rt', { name: 'online', value: false })
      logger.warn(`socket.io disconnected from ${addr} socket -- ${reason}`)
    })

    socket.on('data', (data) => {
      try {
        dataProcess(JSON.parse(data))
      } catch (err) {
        logger.error(`socket.io data error -- ${data}`)
      }
    })

    logger.info(`socket.io start on -- ${addr} - ${uid}`)
  } catch (err) {
    logger.error(`socket connection error -- ${err}`)
  }
}

export { socket, socketConnect }
