import axios from 'axios'
import fs from 'fs'
import path from 'path'
import https from 'https'
import FormData from 'form-data'
import logger from 'src-electron/logger'
import db from 'src-electron/db'

// axios defaults
axios.defaults.agent = new https.Agent({ rejectUnauthorized: false })

// make url
function makeUrl(ipaddress, folder, filename) {
  return `https://${ipaddress}/api/cores/self/media/Messages${
    folder ? '/' + folder : ''
  }${filename ? '/' + filename : ''}`
}

// get file meta data
async function qsysGetMeta(device, obj) {
  try {
    const { folder, filename } = obj
    return await axios.get(makeUrl(device.ipaddress, folder, filename))
  } catch (err) {
    return err
  }
}
// make folder
async function qsysMakeFolder(device, obj) {
  try {
    const { folder, foldername } = obj
    return await axios.post(makeUrl(device.ipaddress, folder), {
      name: foldername
    })
  } catch (err) {
    return err
  }
}

// getfileinfolder
async function qsysGetFiles(device, obj) {
  try {
    return await axios.get(makeUrl(device.ipaddress, obj.folder))
  } catch (err) {
    return err
  }
}

// upload file
async function qsysUploadFile(device, obj) {
  try {
    const { filepath, filename, folder } = obj
    // find media path
    const mediaPath = await db.findOne({ key: 'mediafolder' })
    if (!mediaPath) return 'media path not found'
    // make file full path
    const fileFullPath = path.resolve(mediaPath.value, filepath, filename)
    if (!fs.existsSync(fileFullPath)) return 'uplaod file not exists'
    // make file stream
    const fileStream = fs.createReadStream(fileFullPath)
    // make form data
    const formData = new FormData()
    formData.append(media, fileStream)
    // start upload
    return await axios.post(makeUrl(device.ipaddress, folder), formData, {
      headers: { ...formData.getHeaders() }
    })
  } catch (err) {
    return err
  }
}

async function deleteFile(device, obj) {
  try {
    const { folder, filename } = obj
    return await axios.delete(makeUrl(device.ipaddress, folder, filename))
  } catch (err) {
    return err
  }
}

export { qsysGetMeta, qsysMakeFolder, qsysGetFiles, qsysUploadFile, deleteFile }
