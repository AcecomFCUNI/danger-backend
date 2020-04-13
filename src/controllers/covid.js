const axios = require('axios')

const Departments = require('../../mongo/models/departments')
const TotalData = require('../../mongo/models/totalData')

import { cleaner } from '../../functions/cleaner'
import { dateGenerator } from '../../functions/dateGenerator'
import { queryGenerator } from '../../functions/queryGenerator'

const url = process.env.COVID_PERU_CASES

class CovidController {
  async init (args) {
    let { date } = args
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

        return {
          success: true,
          error  : false,
          message: 'The data was successfully stored in the database'
        }
      } catch (error) {
        throw new Error('Error while saving the data in the database')
      }
    } catch (error) {
      throw new Error('Error while loading the data')
    }
  }
}

export { CovidController }