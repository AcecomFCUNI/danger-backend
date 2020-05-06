import express from 'express'
import { CurrentDate } from '../controllers/currentDate'

const router = express.Router()

const cd = new CurrentDate()

router.get('/', async (req, res) => {
  try {
    const result = await cd.getCurrentDate()
    res.send({
      error  : false,
      message: {
        currentDate: result
      }
    })
  } catch (error) {
    res.send({
      error  : true,
      message: error.message
    })
  }
})

export { router as CurrentDate }
