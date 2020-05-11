import { DepartmentsModel } from '../mongo/models/departments'
import { TotalDataModel } from '../mongo/models/totalData'

import { dateUTCGenerator } from '../functions/dateGenerator'

class TotalDataFromPeru {
  async init (args) {
    let { name } = args
    let data

    try {
      if(name === 'peru') {
        data = await TotalDataModel.find(
          {},
          'createdAt totalCases totalDeaths totalDiscarded totalRecovered'
        ).sort({ createdAt: 1 })

        data = data.map((element) => {
          const date = dateUTCGenerator(element.createdAt)

          return {
            createdAt     : date,
            totalCases    : element.totalCases,
            totalDeaths   : element.totalDeaths,
            totalDiscarded: element.totalDiscarded,
            totalRecovered: element.totalRecovered
          }
        })
      } else {
        name = name.toUpperCase()
        // Query to get all the data per departments by day
        data = await DepartmentsModel.find(
          { 'departments.name': name },
          {
            _id        : false,
            createdAt  : true,
            departments: { $elemMatch: { name: name } }
          }
        ).sort({ createdAt: 1 })
        // Formatting the data
        data = data.map((element) => {
          const date = dateUTCGenerator(element.createdAt)

          return {
            createdAt  : date,
            totalCases : element.departments[0].cases,
            totalDeaths: element.departments[0].deaths
          }
        })
      }

      return data
    } catch (error) {
      throw new Error('Error while getting the data from the database')
    }
  }
}

export { TotalDataFromPeru as TotalData }
