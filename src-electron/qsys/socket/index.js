import { socket } from 'src-electron/socket'

const sendSocketData = (args) => {
  socket.emit('qsys:data', JSON.stringify({ ...args }))
}

export { sendSocketData }
