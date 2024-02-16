import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStatusStore = defineStore('status', () => {
  const status = ref({
    serverAddr: '127.0.0.1',
    serverPort: 2990,
    connected: false
  })
  return { status }
})
