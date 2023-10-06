import { addQsys } from 'app/src-electron/qsys'
import { rtIPC } from 'src-electron/ipc'
import { updateDevices } from 'src-electron/devices'

export default async function (obj) {
  const { command, value } = obj
  switch (command) {
    case 'devices':
      updateDevices(value)
      rtIPC('socket:rt', { name: 'devices', value: value })
      addQsys(value)
      break
  }
}
