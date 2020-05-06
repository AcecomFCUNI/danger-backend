import { Departments } from '../mongo/models/departments'
import { TotalData } from '../mongo/models/totalData'

class DataPerDay {
  async init (args) {
    try {
      let { date } = args
      date = new Date(`${date}T00:00:00.000Z`)

      let result = await Promise.all([
        TotalData.find({ createdAt: { $eq: date } }).exec(),
        Departments.find({ createdAt: { $eq: date } }).exec()
      ])

      const totalDataResult = result[0][0]
      const departmentsResult = result[1][0]

      result[0] = {
        createdAt     : totalDataResult.createdAt,
        totalCases    : totalDataResult.totalCases,
        totalDeaths   : totalDataResult.totalDeaths,
        totalDiscarded: totalDataResult.totalDiscarded,
        totalRecovered: totalDataResult.totalRecovered
      }

      const departments = departmentsResult.departments.map(
        ({ name, cases, deaths }) => ({
          name       : name,
          totalCases : cases,
          totalDeaths: deaths
        })
      )

      result[1] = {
        createdAt  : departmentsResult.createdAt,
        departments: departments
      }

      return result
    } catch (error) {
      throw new Error('Error while getting the data from the database')
    }
  }
}

export { DataPerDay }
