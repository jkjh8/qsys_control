import { EventEmitter } from 'events'
import net from 'net'
import logger from 'src-electron/logger'

export default class Qrc extends EventEmitter {
  constructor(obj) {
    super()
    this.name = obj.name
    // tcp socket
    this.ipaddress = obj.ipaddress
    this.client = new net.Socket()
    this.ivConnection = null
    this.timeout = 60
    this.connected = false
    // commands
    this.commands = []
    this.ivCommands = null
    // data
    this.data = Buiffer.alloc(0)

    // events
    this.client.on('connect', () => {
      this.connected = true
      // socket keep alive
      this.setTimeout()
    })

    this.client.on('close', () => {
      this.connected = false
      clearInterval(this.ivConnection)
      logger.warn(`qsys ${this.name} - ${this.ipaddress} disconnected`)
    })

    this.client.on('timeout', () => {
      logger.warn(`qsys ${this.name} - ${this.ipaddress} connection timeout`)
    })

    this.client.on('error', (err) => {
      logger.error(`qsys ${this.name} - ${this.ipaddress} error -- ${err}`)
    })

    this.client.on('data', (data) => {
      // TODO: data process
    })
  }

  connect() {
    if (this.connected) {
      return logger.warn(
        `qsys ${this.name} - ${this.ipaddress} is already connected`
      )
    }
    try {
      this.client.connect({ port: 1710, host: this.ipaddress })
    } catch (err) {
      logger.error(
        `qsys ${this.name} - ${this.ipaddress} connect error -- ${err}`
      )
    }
  }

  disconnect() {
    if (this.ivCommands) {
      clearInterval(this.ivCommands)
    }
    clearInterval(this.ivConnection)
    this.ivCommands = null
    this.ivConnection = null
    if (this.connected) {
      this.client.end()
    }
  }

  addConnand(msg) {
    this.commands.push(msg)
    if (!this.ivCommands) {
      this.commandProcess()
    }
  }

  commandProcess() {
    this.ivCommands = setInterval(() => {
      if (this.commands.length) {
        this.send(this.commands.shift())
      } else {
        clearInterval(this.ivCommands)
        this.ivCommands = null
      }
    }, 500)
  }

  send(msg) {
    if (this.connected) {
      this.client.write(
        JSON.stringify({
          jsonrpc: '2.0',
          ...msg
        }) + '\x00'
      )
    } else {
      logger.warn(
        `qsys ${this.name} - ${this.ipaddress} send data failed -- socket not connected command: ${msg}`
      )
    }
  }

  setTimout() {
    if (this.ivConnection) {
      return logger.info(
        `qsys ${this.name} - ${this.ipaddress} set connection timeout failed -- timeout interval is alive`
      )
    } else {
      this.ivConnection = setInterval(() => {
        this.timeout = this.timeout - 1
        if (this.timeout < 5) {
          this.addCommand({ method: 'NoOp', params: {} })
          this.timeout = 60
        }
        // clear interval at disconnected
        if (!this.connected) {
          clearInterval(this.ivConnection)
          this.ivConnection = null
          this.timeout = 60
          logger.warn = `qsys ${this.name} - ${this.ipaddress} clear interval -- socket not connected`
        }
      })
    }
  }
}
