import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ipc', {
  send: (channel, args) => {
    return ipcRenderer.send(channel, args)
  },
  on: (channel, fn) => {
    console.log(`event listener on ${channel}`)
    ipcRenderer.on(channel, (_event, ...args) => {
      return fn(...args)
    })
  },
  invoke: async (channel, args) => {
    await ipcRenderer.invoke(channel, { ...args })
  },
  removeEventListener: (channel) => {
    console.log(`remove event listener on ${channel}`)
    return ipcRenderer.removeAllListeners(channel)
  }
})
