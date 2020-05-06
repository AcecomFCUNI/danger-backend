import Debug from 'debug'
import http from 'http'
import { CronJob } from 'cron'

import { app } from '../app'
import { Covid } from '../controllers/covid'
import { connection } from '../mongo/index'

const debug = Debug('covidperu:server')
const PORT = process.env.PORT

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


  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

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
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(PORT || '3000')
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

connection.on('error', () => {
  console.log(
    'There was a problem while establishing a connection with the database'
  )
})
connection.once('open', () => {
  console.log('We are connected with the database!')
})

const job = new CronJob('00 30 15 * * *', () => {
  const currentDate = new Date(new Date().getTime() + 24*60*60*1000)
  let month, day
  const cc = new Covid()

  currentDate.getMonth() >= 10
    ? month =  (currentDate.getMonth() + 1).toString()
    : month = `0${currentDate.getMonth() + 1}`

    currentDate.getUTCDate() >= 10
    ? day = currentDate.getUTCDate().toString()
    : day = `0${currentDate.getUTCDate()}`

  const args = { date: `${currentDate.getFullYear()}-${month}-${day}` }
  console.log(args)
  cc.init(args)
})

job.start()