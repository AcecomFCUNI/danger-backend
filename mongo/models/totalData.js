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

module.exports = mongoose.model('TotalData', TotalData)
