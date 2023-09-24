import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useDeviceStore = defineStore('devices', () => {
  const devices = ref([])

  return { devices }
})
