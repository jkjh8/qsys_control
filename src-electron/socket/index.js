import { io } from 'socket.io-client'
import logger from 'src-electron/logger'
import { rtIPC, rtStatus } from 'src-electron/ipc'
import {
  addlistQsysDevice,
  addListQsysDevices
} from 'src-electron/qsys/devices'
import { Status } from 'src-electron/defaultVal'
import ioParser from './parser'
import {
  setQsysGain,
  setQsysMute,
  fnSetTransmitters,
  fnSetTransmitter,
  fnCancelAll
} from '../qsys/toQsys'

let socket

async function socketConnect(addr, uid) {
  try {
    socket = io(`http://${addr}/bridge`, {
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
      logger.info(`socket.io connected to ${addr} socket -- ${socket.id}`)
    })

    socket.on('disconnect', (reason) => {
      Status.connected = false
      logger.warn(`socket.io disconnected from ${addr} socket -- ${reason}`)
      setTimeout(() => {
        try {
          socket.connect()
        } catch (error) {
          logger.errror(`socket.io reconnect error: ${error}`)
        }
      }, 5000)
    })

    socket.on('qsys:devices', (args) => {
      try {
        addListQsysDevices(args)
        rtIPC('device:rt', args)
        console.log('update devices')
      } catch (error) {
        logger.error(`qsys:devices -- ${error}`)
      }
    })

    socket.on('qsys:zone', (args) => {
      try {
        fnSetTransmitter(args)
      } catch (error) {
        logger.error(`qsys:zone -- ${error}`)
      }
    })

    socket.on('qsys:refreshAll', (args) => {
      try {
        fnSetTransmitters(args.deviceId)
      } catch (error) {
        logger.error(`qsys:refreshAll -- ${error}`)
      }
    })

    socket.on('qsys:volume', (args) => {
      try {
        const { deviceId, zone, value } = args
        setQsysGain(deviceId, zone, value)
      } catch (error) {
        logger.error(`qsys:volume -- ${error}`)
      }
    })

    socket.on('qsys:mute', (args) => {
      try {
        const { deviceId, zone, value } = args
        setQsysMute(deviceId, zone, value)
      } catch (error) {
        logger.error(`qsys:mute -- ${error}`)
      }
    })

    socket.on('qsys:cancelAll', (args) => {
      try {
        const { deviceId } = args
        fnCancelAll(deviceId)
      } catch (error) {
        logger.error(`qsys:cancelAll -- ${error}`)
      }
    })

    socket.on('qsys:command', (comm) => {
      console.log(comm)
      try {
        ioParser(JSON.parse(comm))
      } catch (error) {
        logger.error(`io paser error -- ${error}`)
      }
    })

    // socket.on('qsys:data', async (data) => {
    //   try {
    //     const obj = JSON.parse(data)
    //     switch (obj.key) {
    //       case 'connect':
    //         rtIPC('socket:rt', { name: 'devices', value: obj.value })
    //         // addQsys(obj.value)
    //         break
    //       case 'devices':
    //         rtIPC('socket:rt', { name: 'devices', value: obj.value })
    //         // addQsys(obj.value)
    //         break
    //     }
    //   } catch (err) {
    //     logger.error(`socket.io data error -- ${err}`)
    //   }
    // })
    logger.info(`socket.io start on -- ${addr} - ${uid}`)
  } catch (err) {
    logger.error(`socket connection error -- ${err}`)
  }
}

export { socket, socketConnect }
