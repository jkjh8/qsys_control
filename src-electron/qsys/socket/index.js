import { socket } from 'src-electron/socket'

const sendSocketData = (args) => {
  socket.emit('qsys:data', JSON.stringify({ ...args }))
}
const sendQsysConnect = (device) => {
  socket.emit('qsys:connect', { ...device })
}
const sendQsysDisconnect = (device) => {
  socket.emit('qsys:disconnect', { ...device })
}
const ioSendEngineStatus = (args) => {
  socket.emit('qsys:EngineStatus', { ...args })
}
const ioSendZoneStatus = (args) => {
  socket.emit('qsys:ZoneStatus', { ...args })
}
const ioSendZoneStatusConfigure = (args) => {
  socket.emit('qsys:ZoneStatusConfigure', { ...args })
}
const ioSendPaConfig = (args) => {
  socket.emit('qsys:PaConfig', { ...args })
}
const ioSendPageMessage = (args) => {
  socket.emit('qsys:page:message', { ...args })
}
const ioSendPageLive = (args) => {
  socket.emit('qsys:page:message', { ...args })
}
const ioSendPageStop = (args) => {
  socket.emit('qsys:page:stop', { ...args })
}
const ioSendPageCancel = (args) => {
  socket.emit('qsys:page:cancel', { ...args })
}

export {
  sendSocketData,
  sendQsysConnect,
  sendQsysDisconnect,
  ioSendEngineStatus,
  ioSendZoneStatus,
  ioSendZoneStatusConfigure,
  ioSendPaConfig,
  ioSendPageMessage,
  ioSendPageLive,
  ioSendPageStop,
  ioSendPageCancel
}
