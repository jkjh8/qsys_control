import { app } from 'electron'

const folder = app.getPath('documents')
console.log(folder)

const Status = {
  serverAddr: '127.0.0.1',
  serverPort: 80,
  deviceId: '',
  connected: false,
  mediafolder: folder
}

export { Status }
