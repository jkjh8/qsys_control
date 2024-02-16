import { storeToRefs } from 'pinia'
import { useDeviceStore } from 'src/stores/devices.js'

export default function () {
  const { devices } = storeToRefs(useDeviceStore())

  ipc.on('socket:rt', (obj) => {
    console.log(obj)
    const { name, value } = obj
    switch (name) {
      case 'devices':
        devices.value = value
        break
    }
  })
}
