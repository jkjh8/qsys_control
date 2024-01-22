import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStatusStore = defineStore('status', () => {
  const status = ref({
    serverAddr: '127.0.0.1',
    serverPort: 80,
    connected: false
  })

  const initStatusRt = function () {
    ipc.on('status:rt', (args) => {
      for (let item in args) {
        switch (item) {
          case 'serverAddr':
            status.value.serverAddr = args[item]
            break
          case 'serverPort':
            status.value.serverPort = args[item]
            break
          case 'connected':
            status.value.connected = args[item]
            break
          case 'deviceId':
            status.value.deviceId = args[item]
            break
          case 'mediafolder':
            status.value.mediafolder = args[item]
            break
        }
      }
    })
  }
  return { status, initStatusRt }
})
