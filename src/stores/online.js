import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useOnlineStore = defineStore('online', () => {
  const online = ref(false)
  return { online }
})
