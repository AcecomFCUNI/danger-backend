/* eslint-disable sort-keys */
const express = require('express')
const router = express.Router()

import { CurrentDate } from '../controllers/currentDate'

const cd = new CurrentDate()

router.get('/', async (req, res) => {
  try {
    const result = await cd.getCurrentDate()
    res.send({
      success: true,
      error  : false,
      message: {
        currentDate: result
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
