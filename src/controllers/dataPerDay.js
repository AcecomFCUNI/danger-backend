import { DepartmentsModel } from '../mongo/models/departments'
import { TotalDataModel } from '../mongo/models/totalData'
import { correctSpelling } from '../functions/correctSpelling'

class DataPerDay {
  async init (args) {
    try {
      let { date } = args
      date = new Date(`${date}T00:00:00.000Z`)

      let result = await Promise.all([
        TotalDataModel.findOne({ createdAt: { $eq: date } }),
        DepartmentsModel.findOne({ createdAt: { $eq: date } })
      ])

      const totalDataResult = result[0]
      const departmentsResult = result[1]

      result[0] = {
        totalCases    : totalDataResult.totalCases,
        totalDeaths   : totalDataResult.totalDeaths,
        totalDiscarded: totalDataResult.totalDiscarded,
        totalRecovered: totalDataResult.totalRecovered
      }

      const departments = departmentsResult.departments.map(
        ({ name, cases, deaths }) => ({
          name       : correctSpelling(name),
          totalCases : cases,
          totalDeaths: deaths
        })
      )

      result[1] = {
        departments: departments
      }

      return result
    } catch (error) {
      throw new Error('Error while getting the data from the database')
    }
  }
}

export { DataPerDay }
