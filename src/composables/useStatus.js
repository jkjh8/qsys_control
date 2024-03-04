import { ref } from 'vue'

const status = ref({
  serverAddr: '127.0.0.1',
  serverPort: 2990,
  connected: false
})

export { status }
