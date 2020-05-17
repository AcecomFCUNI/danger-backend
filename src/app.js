import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import { setRoutes } from './routes/routes'

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

setRoutes(app)

export { app }
