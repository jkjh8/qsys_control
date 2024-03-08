import logger from 'src-electron/logger'
import { setQsysGain, setQsysMute } from 'src-electron/qsys/toQsys'

export default function (args) {
  try {
    const { deviceId, command } = args
    switch (command) {
      case 'changeVol':
        setQsysGain(deviceId, args.zone, args.value)
        break
      case 'changeMute':
        setQsysMute(deviceId, args.zone, args.value)
        break
    }
  } catch (err) {
    logger.error(`io parser error: ${err}`)
  }
}
