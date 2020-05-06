import axios from 'axios'
import nodemailer from 'nodemailer'

import { Departments } from '../mongo/models/departments'
import { TotalData } from '../mongo/models/totalData'

import { cleaner } from '../functions/cleaner'
import { dateGenerator, dateUTCGenerator } from '../functions/dateGenerator'
import { queryGenerator } from '../functions/queryGenerator'

const URL = process.env.COVID_PERU_CASES
const EMAIL = process.env.EMAIL
const PASSWORD = process.env.PASSWORD
const PORT = process.env.PORT

class CovidController {
  async init (args) {
    let { date } = args
    const queryBody = queryGenerator(URL, date)

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
          await this.mailer(
            true,
            date,
            `Error while updating the database\n${error.message}`
          )
        } catch (error) {
          throw new Error('Error while sending the email')
        }
        throw new Error('Error while updating the database')
      }
    } catch (error) {
      try {
        await this.mailer(
          true,
          date,
          `Error while loading the data.\n${error.message}`
        )
      } catch (error) {
        throw new Error('Error while sending the email')
      }
      throw new Error(`Error while loading the data.\n${error.message}`)
    }
  }

  async mailer (error, date, message = null) {
    const transporter = nodemailer.createTransport({
      auth: {
        pass: PASSWORD,
        user: EMAIL
      },
      service: 'gmail'
    })
    let text, subject
    if(error) {
      text = message
      subject = 'Error'
    } else {
      subject = 'Confirmation'
      if(PORT === '4000')
        // eslint-disable-next-line max-len
        text = `The database was successfully updated with the information of ${date}. It was updated from Anthony's laptop.`
      else
        // eslint-disable-next-line max-len
        text = `The database was successfully updated with the information of ${date}. It was updated from Heroku server.`
    }
    const mailOptions = {
      from   : `ACECOM's Covid app`,
      subject: subject,
      text   : text,
      to     : 'sluzquinosa@uni.pe, bryan.ve.bv@gmail.com'
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if(error) console.log(error)
      else console.log(info)
    })
  }
}

export { CovidController as Covid}
