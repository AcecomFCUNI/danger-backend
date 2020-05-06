import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import { TotalData } from './routes/totalData'
import { CurrentDate } from './routes/currentDate'
import { DataPerDay } from './routes/dataPerDay'

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

app.use('/totalData', TotalData)
app.use('/currentDate', CurrentDate)
app.use('/dataPerDay', DataPerDay)

export { app }
