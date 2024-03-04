import { ref } from 'vue'

const devices = ref([])

const fnUpdateDevices = (arr) => {
  devices.value = arr
}

export { devices, fnUpdateDevices }
