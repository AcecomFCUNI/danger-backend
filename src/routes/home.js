import express from 'express'
import { response } from '../functions/response'
import { CurrentDate } from '../controllers/currentDate'

const router = express.Router()
const cd = new CurrentDate()

router.get('/', async (req, res) => {
  try {
    const message = 'Welcome to ACECOM\'s Covid-19 API'
    const updatedAt = await cd.getCurrentDate()

    response(res, null, { message, updatedAt }, 200)
  } catch (error) {
    response(res, true, 'Internal Server error', 500)
    console.log(error)
  }
})

export { router as Home }
