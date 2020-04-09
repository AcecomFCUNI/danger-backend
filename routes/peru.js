const express = require('express')
const router = express.Router()
const axios = require('axios')

import { cleaner } from '../functions/cleaner'
import { dateGenerator } from '../functions/dateGenerator'
import { queryGenerator } from '../functions/queryGenerator'

const Departments = require('../mongo/models/departments')
const TotalData = require('../mongo/models/totalData')

const url = process.env.COVID_PERU_CASES

router.get('/covid/peru/:date', async (req, res) => {
  console.log(req.params.date)
  const date = new Date(`${req.params.date}T00:00:00.000Z`)
  console.log(date)
  
  try {
    const result = await Promise.all([
      TotalData.find({ createdAt: { $eq: date } }).exec(),
      Departments.find({ createdAt: { $eq: date } }).exec()
    ])
    res.send({
      success: true,
      error  : false,
      message: {
        totalData  : result[0],
        departments: result[1]
      }
    })
  } catch (error) {
    console.log(error)
    res.send({
      success: false,
      error  : true,
      message: 'Error while getting the data from the database'
    })
  }
})

router.post('/covid/peru', async (req, res) => {
  let {
    body: { date }
  } = req

  const queryBody = queryGenerator(url, date)

  try {
    let response = await axios({
      url: queryBody
    })

    response = cleaner(response.data.features)

    date = dateGenerator(date)

    const departments = new Departments({
      createdAt: date,
      departments: response.departments
    })

    const totalData = new TotalData({
      createdAt     : date,
      totalCases    : response.totalCases,
      totalDiscarded: response.totalDiscarded,
      totalRecovered: response.totalRecovered,
      totalDeaths   : response.totalDeaths || 0
    })

    try {
      await Promise.all([departments.save(), totalData.save()])

      res.send({
        success: true,
        error  : false,
        message: 'The data was successfully stored in the database'
      })
    } catch (error) {
      res.send({
        success: false,
        error: true,
        message: 'Error while saving the data in the database'
      })
    }
  } catch (error) {
    console.log(error)
    res.send({
      success: false,
      error  : true,
      message: 'Error while loading the data'
    })
  }
})

module.exports = router
