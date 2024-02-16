import net from 'net'
import { BrowserWindow as bw } from 'electron'
import logger from 'src-electron/logger'
import { Status } from 'src-electron/defaultVal'
let tcpSocket = null

function getTcpSocket(port, host) {
  tcpSocket = net.connect({ port, host })

  tcpSocket.setEncoding('utf8')

  tcpSocket.on('connect', () => {
    Status.connected = true
    bw.fromId(1).webContents.send('status:rt', Status)
    tcpSocketWrite({ comm: 'qsys:get' })
    logger.info(`TCP Connected to ${host}:${port}`)
  })

  tcpSocket.on('data', (data) => {
    console.log('from tcp socket = ', data)
  })

  tcpSocket.on('close', () => {
    Status.connected = false
    bw.fromId(1).webContents.send('status:rt', Status)
    logger.warn('TCP Socket Connection closed')
    setTimeout(() => {
      getTcpSocket(port, host)
    }, 5000)
  })

  tcpSocket.on('error', (err) => {
    logger.error(`TCP Socket error ${err}`)
  })
}

function tcpSocketWrite(data) {
  try {
    tcpSocket.write(JSON.stringify(data))
  } catch (error) {
    logger.error(`TCP Socket write error ${error}`)
  }
}

export { getTcpSocket, tcpSocket, tcpSocketWrite }
