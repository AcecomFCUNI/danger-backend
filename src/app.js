import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import { Home } from './routes/home'
import { CurrentDate } from './routes/currentDate'
import { DataPerDay } from './routes/dataPerDay'
import { TotalData } from './routes/totalData'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use('', Home)
app.use('/totalData', TotalData)
app.use('/currentDate', CurrentDate)
app.use('/dataPerDay', DataPerDay)

export { app }
