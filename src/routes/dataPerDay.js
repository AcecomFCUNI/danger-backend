import express from 'express'
import { DataPerDay } from '../controllers/dataPerDay'

const router = express.Router()

const dpd = new DataPerDay()

router.post('/', async (req, res) => {

  try {
    let { body: { args } } = req

    const result = await dpd.init(args)

    res.send({
      error  : false,
      message: {
        departmentsData: result[1],
        totalData      : result[0]
      }
    })
  } catch (error) {
    res.send({
      error  : true,
      message: error.message
    })
  }
})

export { router as DataPerDay }
