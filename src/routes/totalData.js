const express = require('express')
const router = express.Router()

import { TotalDataFromPeru } from '../controllers/totalData'

const td = new TotalDataFromPeru()

router.post('/', async (req, res) => {

  try {
    const { body: { args } } = req
    const result = await td.init(args)

    res.send(result)
  } catch (error) {
    res.send({
        success: false,
        error  : true,
        message: error.message
    })
  }

})

module.exports = router
