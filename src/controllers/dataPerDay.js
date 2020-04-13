const Departments = require('../../mongo/models/departments')
const TotalData = require('../../mongo/models/totalData')

class DataPerDay {
  async init (args) {
    try {
      let { date } = args
      date = new Date(`${date}T00:00:00.000Z`)

      let result = await Promise.all([
        TotalData.find({ createdAt: { $eq: date } }).exec(),
        Departments.find({ createdAt: { $eq: date } }).exec()
      ])

      result[0] = {
        createdAt     : result[0][0].createdAt,
        totalCases    : result[0][0].totalCases,
        totalDiscarded: result[0][0].totalDiscarded,
        totalRecovered: result[0][0].totalRecovered,
        totalDeaths   : result[0][0].totalDeaths
      }

      const departments = result[1][0].departments.map(
        ({ name, cases, deaths }) => ({
          name       : name,
          totalCases : cases,
          totalDeaths: deaths
        })
      )

      result[1] = {
        createdAt  : result[1][0].createdAt,
        departments: departments
      }

      return result
    } catch (error) {
      throw new Error('Error while getting the data from the database')
    }
  }
}

export { DataPerDay }
