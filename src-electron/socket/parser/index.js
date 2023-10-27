import logger from 'src-electron/logger'
import { setChannelMute, setChannelGain } from 'src-electron/qsys/commands'

export default function (args) {
  try {
    const { deviceId, command } = args
    switch (command) {
      case 'changeMute':
        setChannelMute(deviceId, args.zone, args.value)
        break
      case 'changeVol':
        setChannelGain(deviceId, args.zone, args.value)
        break
    }
  } catch (err) {
    logger.error(`io parser error: ${err}`)
  }
}
