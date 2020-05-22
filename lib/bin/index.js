"use strict";

var _debug = _interopRequireDefault(require("debug"));

var _http = _interopRequireDefault(require("http"));

var _cron = require("cron");

var _app = require("../app");

var _dataBaseUpdater = require("../functions/dataBaseUpdater");

var _index = require("../mongo/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug.default)('covidperu:server');
const PORT = process.env.PORT; // Event listener for HTTP server "error" event.

const onError = error => {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT; // handle specific listen errors with friendly messages

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;

    default:
      throw error;
  }
}; // Event listener for HTTP server "listening" event.


const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}; // Set the port from environment.


_app.app.set('port', PORT);

console.log(`APP RUNNING AT PORT ${PORT}`); // Create HTTP server.

const server = _http.default.createServer(_app.app); // Listen on provided port, on all network interfaces.


server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);

_index.connection.on('error', () => {
  console.log('There was a problem while establishing a connection with the database');
});

_index.connection.once('open', () => {
  console.log('We are connected with the database!');
}); // Setting the cronjob for production


const job = new _cron.CronJob('00 30 19 * * *', () => {
  const currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  let month, day;
  const cc = new _dataBaseUpdater.Updater();
  currentDate.getMonth() >= 10 ? month = (currentDate.getMonth() + 1).toString() : month = `0${currentDate.getMonth() + 1}`;
  currentDate.getUTCDate() >= 10 ? day = currentDate.getUTCDate().toString() : day = `0${currentDate.getUTCDate()}`;
  const args = {
    date: `${currentDate.getFullYear()}-${month}-${day}`
  };
  console.log(args);
  cc.init(args);
});
job.start(); // Handle unhandled rejection warning
// process.on('unhandledRejection', (reason, p) => {
//   console.log(`Unhandled rejection at promise ${p}\nReason: ${reason}`)
// })