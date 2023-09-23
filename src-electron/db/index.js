import { app } from 'electron'
import Datastore from 'nedb-promises'
import path from 'path'
import logger from '../logger'

let db
// datastore path
const dbpath = path.join(app.getPath('userData'), 'qsyscontrol', 'datastore.db')

// initialize the datastore
try {
  db = new Datastore({
    filename: dbpath,
    timestampData: true,
    autoload: true
  })
  logger.info(`Database initialized`)
  logger.info(`Database data file path: ${dbpath}`)
} catch (error) {
  logger.error(`database initialization error: ${error}`)
}
export default db
