import { app } from 'electron'
import Datastore from 'nedb'
import path from 'path'
import logger from '../logger'

// datastore path
const dbpath = path.join(app.getPath('userData'), 'qsyscontrol', 'datastore.db')
logger.info(`Database file: ${dbpath}`)
// initialize the datastore
const db = new Datastore({ filename: dbpath, autoload: true })

export default db
