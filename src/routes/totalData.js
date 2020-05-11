import express from 'express'
import { TotalData } from '../controllers/totalData'
import { response } from '../functions/response'

const router = express.Router()

const td = new TotalData()

router.post('/', async (req, res) => {
  const { body: { args } } = req

  try {
    const result = await td.init(args)

    response(res, false, result, 200)
  } catch (error) {
    response(res, true, error.message, 500)
  }
})

export { router as TotalData }
