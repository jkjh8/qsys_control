import { rtIPC } from 'src-electron/ipc'

export default async function (obj) {
  const { command, value } = obj
  switch (command) {
    case 'devices':
      rtIPC('socket:rt', { name: 'devices', value: value })
      break
  }
}
