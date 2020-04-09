const express = require('express')
const router = express.Router()
const axios = require('axios')

import { cleaner } from '../functions/cleaner'
import { dateGenerator, dateUTCGenerator } from '../functions/dateGenerator'
import { queryGenerator } from '../functions/queryGenerator'

const Departments = require('../mongo/models/departments')
const TotalData = require('../mongo/models/totalData')

const url = process.env.COVID_PERU_CASES

router.get('/currentDate', async (req, res) => {
  try {
    let date = await TotalData.find().sort({ createdAt: -1 }).limit(1)

    date = date[0].createdAt

    const current = dateUTCGenerator(date)

    res.send({
      success: true,
      error  : false,
      message: {
        currentDate: `${current.year}-${current.month}-${current.day}`
      }
    })
  } catch (error) {
    console.log(error)
    res.send({
      success: false,
      error  : true,
      message: 'Error while getting the current date from the database'
    })
  }
})

router.get('/totalData/:name', async (req, res) => {
  let wanted = req.params.name
  let data
  try {
    if (wanted === 'peru'){
      data = await TotalData.find(
        {},
        {
          _id           : false,
          createdAt     : true,
          totalCases    : true,
          totalDiscarded: true,
          totalRecovered: true,
          totalDeaths   : true
        }
      )
      data = data.map(element => {
        const date = dateUTCGenerator(element.createdAt)
        return {
          createdAt     : `${date.year}-${date.month}-${date.day}`,
          totalCases    : element.totalCases,
          totalDiscarded: element.totalDiscarded,
          totalRecovered: element.totalRecovered,
          totalDeaths   : element.totalDeaths
        }
      })
    }
    else {
      wanted = wanted.toUpperCase()
      // Query to get all the data per departments by day
      data = await Departments.find(
        { 'departments.name': wanted },
        {
          _id        : false,
          createdAt  : true,
          departments: { $elemMatch: { name: wanted } }
        }
      )
      // Formatting the data
      data = data.map(element => {
        const date = dateUTCGenerator(element.createdAt)
        return {
          createdAt: `${date.year}-${date.month}-${date.day}`,
          data     : {
            cases : element.departments[0].cases,
            deaths: element.departments[0].deaths
          }
        }
      })
    }
    res.send({
      success: true,
      error  : false,
      message: { name: wanted, data: data }
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

router.get('/:date', async (req, res) => {
  const date = new Date(`${req.params.date}T00:00:00.000Z`)

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

router.post('/', async (req, res) => {
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
      createdAt  : date,
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
        error  : true,
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