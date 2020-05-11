import { TotalDataModel } from '../mongo/models/totalData'
import { dateUTCGenerator } from '../functions/dateGenerator'

class CurrentDate {
  async getCurrentDate () {
    try {
      let date = await TotalDataModel.findOne({}, 'createdAt')
        .sort({ createdAt: -1 })
        .limit(1)
      date = date.createdAt
      const current = dateUTCGenerator(date)

      return current
    } catch (error) {
      console.log(error)
      throw new Error('Error while getting the current date from the database')
    }
  }
}

export { CurrentDate }
