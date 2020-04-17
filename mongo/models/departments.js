const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Departments = new Schema(
  {
    createdAt  : Date,
    departments: [
      {
        cases : Number,
        deaths: Number,
        name  : String
      }
    ]
  },
  { collection: 'departments' }
)

module.exports = mongoose.model('Departments', Departments)
