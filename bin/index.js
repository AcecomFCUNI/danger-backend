const app = require('../app')
const debug = require('debug')('covidperu:server')
const http = require('http')
const mongoose = require('mongoose')
const CronJob = require('cron').CronJob
import { CovidController } from '../src/controllers/covid'

const mongoUri = process.env.MONGO

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = val => {
  const port = parseInt(val, 10)

  if(isNaN(port))
    // named pipe
    return val


  if(port >= 0)
    // port number
    return port


  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

const onError = error => {
  if(error.syscall !== 'listen')
    throw error


  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)
console.log(`APP RUNNING AT PORT ${port}`)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

mongoose.connect(mongoUri, {
  useNewUrlParser   : true,
  useUnifiedTopology: true
})

const connection = mongoose.connection

connection.on('error', () => {
  console.log(
    'There was a problem while establishing a connection with the database'
  )
})
connection.once('open', () => {
  console.log('We are connected with the database!')
})

const job = new CronJob('00 00 20 * * 0-6', () => {
  const currentDate = new Date(new Date().getTime() + 24*60*60*1000)
  let month
  const cc = new CovidController()

  currentDate.getMonth() >= 10
    ? month =  (currentDate.getMonth() + 1).toString()
    : month = `0${currentDate.getMonth() + 1}`

  // eslint-disable-next-line max-len
  const args = { date: `${currentDate.getFullYear()}-${month}-${currentDate.getUTCDate()}` }
  cc.init(args)
})

job.start()
