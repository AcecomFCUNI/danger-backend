const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const covidRouter = require('./src/routes/covid')
const totalDataRouter = require('./src/routes/totalData')
const currentDateRouter = require('./src/routes/currentDate')
const dataPerDayRouter = require('./src/routes/dataPerDay')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use('/covid', covidRouter)
app.use('/totalData', totalDataRouter)
app.use('/currentDate', currentDateRouter)
app.use('/dataPerDay', dataPerDayRouter)

module.exports = app
