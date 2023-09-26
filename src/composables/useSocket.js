import { storeToRefs } from 'pinia'
import { useOnlineStore } from 'src/stores/online.js'
import { useDeviceStore } from 'src/stores/devices.js'

export default function () {
  const { online } = storeToRefs(useOnlineStore())
  const { devices } = storeToRefs(useDeviceStore())

  ipc.on('socket:rt', (obj) => {
    console.log(obj)
    const { name, value } = obj
    switch (name) {
      case 'online':
        online.value = value
        break
      case 'devices':
        devices.value = value
        break
    }
  })
}
