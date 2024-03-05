import { io } from 'socket.io-client'
import logger from 'src-electron/logger'
import { rtIPC, rtStatus } from 'src-electron/ipc'
import {
  addlistQsysDevice,
  addListQsysDevices
} from 'src-electron/qsys/devices'
import { Status } from 'src-electron/defaultVal'
import ioParser from './parser'

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
      extraHeaders: { type: 'qsys' },
      autoConnect: true
    })

    socket.on('connect', () => {
      Status.connected = true
      // rtStatus()
      // rtIPC('socket:rt', { name: 'online', value: true })
      // socket.emit('getQsysDevices')
      logger.info(`socket.io connected to ${addr} socket -- ${socket.id}`)
    })

    socket.on('disconnect', (reason) => {
      Status.connected = false
      // rtIPC('socket:rt', { name: 'online', value: false })
      // rtStatus()
      logger.warn(`socket.io disconnected from ${addr} socket -- ${reason}`)
      setTimeout(() => {
        socket.connect()
      }, 5000)
    })

    socket.on('qsys:devices', (args) => {
      try {
        addListQsysDevices(args)
      } catch (error) {
        logger.error('qsys:deices', error)
      }
    })

    socket.on('qsys:command', (comm) => {
      console.log(comm)
      try {
        ioParser(JSON.parse(comm))
      } catch (error) {
        logger.error(error)
      }
    })

    socket.on('qsys:data', async (data) => {
      try {
        const obj = JSON.parse(data)
        switch (obj.key) {
          case 'connect':
            rtIPC('socket:rt', { name: 'devices', value: obj.value })
            // addQsys(obj.value)
            break
          case 'devices':
            rtIPC('socket:rt', { name: 'devices', value: obj.value })
            // addQsys(obj.value)
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
