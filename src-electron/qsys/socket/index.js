import { socket } from 'src-electron/socket'

const sendSocketData = (args) => {
  socket.emit('qsys:data', JSON.stringify({ ...args }))
}
const sendQsysConnect = (device) => {
  socket.emit('qsys:connect', JSON.stringify({ ...device }))
}
const sendQsysDisconnect = (device) => {
  socket.emit('qsys:disconnect', JSON.stringify({ ...device }))
}
const ioSendEngineStatus = (args) => {
  socket.emit('qsys:EngineStatus', JSON.stringify({ ...args }))
}
const ioSendZoneStatusConfigure = (args) => {
  socket.emit('qsys:ZoneStatusConfigure', JSON.stringify({ ...args }))
}
const ioSendPaConfig = (args) => {
  socket.emit('qsys:PaConfig', JSON.stringify({ ...args }))
}
const ioSendPageMessage = (args) => {
  socket.emit('qsys:page:message', JSON.stringify({ ...args }))
}
const ioSendPageLive = (args) => {
  socket.emit('qsys:page:message', JSON.stringify({ ...args }))
}
const ioSendPageStop = (args) => {
  socket.emit('qsys:page:stop', JSON.stringify({ ...args }))
}
const ioSendPageCancel = (args) => {
  socket.emit('qsys:page:cancel', JSON.stringify({ ...args }))
}
export {
  sendSocketData,
  sendQsysConnect,
  sendQsysDisconnect,
  ioSendEngineStatus,
  ioSendZoneStatusConfigure,
  ioSendPaConfig,
  ioSendPageMessage,
  ioSendPageLive,
  ioSendPageStop,
  ioSendPageCancel
}
