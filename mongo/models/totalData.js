const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TotalData = new Schema(
  {
    createdAt     : Date,
    totalCases    : Number,
    totalDiscarded: Number,
    totalRecovered: Number,
    totalDeaths   : Number
  },
  { collection: 'totalData' }
)

module.exports = mongoose.model('TotalData', TotalData)
