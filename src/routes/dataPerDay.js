import express from 'express'
import { DataPerDay } from '../controllers/dataPerDay'
import { response } from '../functions/response'

const router = express.Router()

const dpd = new DataPerDay()

router.post('/', async (req, res) => {
  try {
    let {
      body: { args }
    } = req

    const result = await dpd.init(args)

    response(
      res,
      false,
      { departmentsData: result[1], totalData: result[0] },
      200
    )
  } catch (error) {
    response(res, true, error.message, 500)
  }
})

export { router as DataPerDay }
