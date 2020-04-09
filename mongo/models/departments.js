const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Departments = new Schema(
  {
    createdAt  : Date,
    departments: [
      {
        name  : String,
        cases : Number,
        deaths: Number
      }
    ]
  },
  { collection: 'departments' }
)

module.exports = mongoose.model('Departments', Departments)
