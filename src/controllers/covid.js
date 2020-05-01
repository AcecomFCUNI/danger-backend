/* eslint-disable sort-keys */
const axios = require('axios')
const nodemailer = require('nodemailer')

const Departments = require('../../mongo/models/departments')
const TotalData = require('../../mongo/models/totalData')

import { cleaner } from '../../functions/cleaner'
import { dateGenerator, dateUTCGenerator } from '../../functions/dateGenerator'
import { queryGenerator } from '../../functions/queryGenerator'

const url = process.env.COVID_PERU_CASES
const email = process.env.EMAIL
const password = process.env.PASSWORD

class CovidController {
  async init (args) {
    let { date } = args
    const queryBody = queryGenerator(url, date)

    try {
      let response = await axios({
        url: queryBody
      })

      response = cleaner(response.data.features)
      date = dateGenerator(date)

      const departments = new Departments({
        createdAt  : date,
        departments: response.departments
      })

      const totalData = new TotalData({
        createdAt     : date,
        totalCases    : response.totalCases,
        totalDeaths   : response.totalDeaths || 0,
        totalDiscarded: response.totalDiscarded,
        totalRecovered: response.totalRecovered
      })

      try {
        await Promise.all([departments.save(), totalData.save()])
        await this.mailer(false, dateUTCGenerator(date))
      } catch (error) {
        try {
          await this.mailer(true, date, 'Error while updating the database')
        } catch (error) {
          throw new Error('Error while sending the email')
        }
        throw new Error('Error while updating the database')
      }
    } catch (error) {
      try {
        await this.mailer(true, date, 'Error while loading the data')
      } catch (error) {
        throw new Error('Error while sending the email')
      }
      throw new Error('Error while loading the data')
    }
  }

  async mailer (error, date, message=null){
    const transporter = nodemailer.createTransport({
      auth: {
        pass: password,
        user: email
      },
      service: 'gmail'
    })
    const mailOptions = {
      from   : `ACECOM's Covid app`,
      subject: error ? 'Error' : 'Confirmation',
      // eslint-disable-next-line max-len
      text   : error ? message : `The database was successfully updated with the information of ${date}`,
      to     : 'sluzquinosa@uni.pe, bryan.ve.bv@gmail.com'
    }
    // eslint-disable-next-line no-unused-vars
    transporter.sendMail(mailOptions, (error, info) => {
      if(error) console.log(error)
      else console.log(info)
    })
  }
}

export { CovidController }
