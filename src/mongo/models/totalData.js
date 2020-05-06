const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TotalData = new Schema(
  {
    createdAt     : Date,
    totalCases    : Number,
    totalDeaths   : Number,
    totalDiscarded: Number,
    totalRecovered: Number
  },
  { collection: 'totalData' }
)

const TotalDataModel = mongoose.model('TotalData', TotalData)

export { TotalDataModel as TotalData }
