const TotalData = require('../../mongo/models/totalData')

import { dateUTCGenerator } from '../../functions/dateGenerator'

class CurrentDate {
  async getCurrentDate () {
    try {
      let date = await TotalData.find().sort({ createdAt: -1 }).limit(1)
      date = date[0].createdAt
      const current = dateUTCGenerator(date)

      return current
    } catch (error){
      throw new Error('Error while getting the current date from the database')
    }
  }
}

export { CurrentDate }