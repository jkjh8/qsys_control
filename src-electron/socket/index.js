import { io } from 'socket.io-client'
import logger from 'src-electron/logger'
import db from 'src-electron/db'
import { rtIPC } from 'src-electron/ipc'
import dataProcess from './dataProcess'

let socket

async function socketConnect() {
  try {
    const addr = await db.findOne({ key: 'serveraddress' })
    if (!addr) return logger.error('server address not found')

    const uid = await db.findOne({ key: 'deviceid' })
    if (!uid) return logger.error('device id not found')

    socket = io(`http://${addr.value}/qsys`, {
      transports: ['websocket'],
      withCredentials: true,
      rejectUnauthorized: false,
      extraHeaders: { deviceid: uid.value, type: 'qsys' },
      autoConnect: true
    })

    socket.on('connect', () => {
      rtIPC('socket:rt', { name: 'online', value: true })
      logger.info(`socket.io connected to ${addr.value} socket -- ${socket.id}`)
    })

    socket.on('disconnect', () => {
      rtIPC('socket:rt', { name: 'online', value: false })
      logger.warn(
        `socket.io disconnected from ${addr.value} socket -- ${socket.id}`
      )
    })

    socket.on('data', (data) => {
      try {
        dataProcess(data)
      } catch (err) {
        logger.error(`socket.io data error -- ${data}`)
      }
      console.log(`socket.io on data -- ${data}`)
    })

    logger.info(`socket.io start on -- ${addr.value} - ${uid.value}`)
  } catch (err) {
    logger.error(`socket connection error -- ${err}`)
  }
}

export default socket
export { socketConnect }
