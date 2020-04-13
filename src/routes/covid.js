const express = require('express')
const router = express.Router()

import { CovidController } from '../controllers/covid'

const cc = new CovidController()

router.post('/', async (req, res) => {
  try {
    let { body: { args } } = req

    const result = await cc.init(args)

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
