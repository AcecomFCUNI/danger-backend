import express from 'express'
import { TotalData } from '../controllers/totalData'

const router = express.Router()

const td = new TotalData()

router.post('/', async (req, res) => {

  try {
    const { body: { args } } = req
    const result = await td.init(args)

    res.send({
      error  : false,
      message: result
    })
  } catch (error) {
    res.send({
      error  : true,
      message: error.message
    })
  }

})

export { router as TotalData }
