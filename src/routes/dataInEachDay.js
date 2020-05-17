import express from 'express'
import { TotalData } from '../controllers/totalData'
import { fromAccumulateToDaily } from '../functions/fromAccumulateToDaily'
import { response } from '../functions/response'

const router = express.Router()
const td = new TotalData()

router.post('/dataInEachDay', async (req, res) => {
  const { body: { args } } = req
  try {
    let result = await td.init(args)
    result = fromAccumulateToDaily(result, args)

    response(res, false, result, 200)
  } catch (error) {
    response(res, true, error.message, 500)
  }
})

export { router as DataInEachDay }
