import express from 'express'
import { CurrentDate } from '../controllers/currentDate'
import { response } from '../functions/response'

const router = express.Router()

const cd = new CurrentDate()

router.get('/', async (req, res) => {
  try {
    const result = await cd.getCurrentDate()

    response(res, false, { currentDate: result }, 200)
  } catch (error) {
    response(res, true, error.message, 500)
  }
})

export { router as CurrentDate }
