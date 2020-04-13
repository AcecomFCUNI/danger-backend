const express = require('express')
const router = express.Router()

import { DataPerDay } from '../controllers/dataPerDay'

const dpd = new DataPerDay()

router.post('/', async (req, res) => {

  try {
    let { body: { args } } = req

    const result = await dpd.init(args)

    res.send({
      success: true,
      error  : false,
      message: {
        totalData      : result[0],
        departmentsData: result[1]
      }
    })
  } catch (error) {
    res.send({
      success: false,
      error  : true,
      message: error.message
    })
  }
})

module.exports = router
