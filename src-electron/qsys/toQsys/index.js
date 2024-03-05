import { qsysObj, qsysArr } from '../devices'

// 1000
const getQsysStatus = (deviceId) => {
  qsysObj[deviceId].addCommand({ id: 1000, method: 'StatusGet', params: 0 })
}

// 2000
const setQsysPaFeedback = (deviceId, value = true) => {
  qsysObj[deviceId].addCommand({
    id: 2000,
    method: 'PA.ZoneStatusConfigure',
    params: { Enabled: value }
  })
}

export { getQsysStatus, setQsysPaFeedback }
