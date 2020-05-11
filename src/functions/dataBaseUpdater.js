import axios from 'axios'
import nodemailer from 'nodemailer'

import { DepartmentsModel } from '../mongo/models/departments'
import { TotalDataModel } from '../mongo/models/totalData'

import { cleaner } from './cleaner'
import { dateGenerator, dateUTCGenerator } from './dateGenerator'
import { queryGenerator } from './queryGenerator'

const URL = process.env.COVID_PERU_CASES
const EMAIL_SENDER = process.env.EMAIL_SENDER
const EMAIL_RECEPTOR = [
  process.env.EMAIL_RECEPTOR_1,
  process.env.EMAIL_RECEPTOR_2
]
const PASSWORD = process.env.PASSWORD
const PORT = process.env.PORT

class DataBaseUpdater {
  async init (args) {
    let { date } = args
    const queryBody = queryGenerator(URL, date)

    try {
      let response = await axios({
        url: queryBody
      })

      response = cleaner(response.data.features)
      date = dateGenerator(date)

      const departments = new DepartmentsModel({
        createdAt  : date,
        departments: response.departments
      })

      const totalData = new TotalDataModel({
        createdAt     : date,
        totalCases    : response.totalCases,
        totalDeaths   : response.totalDeaths || 0,
        totalDiscarded: response.totalDiscarded,
        totalRecovered: response.totalRecovered
      })

      try {
        await Promise.all([departments.save(), totalData.save()])
        this.mailer(false, dateUTCGenerator(date))
      } catch (error) {
        this.mailer(
          true,
          date,
          `Error while updating the database\n${error.message}`
        )
      }
    } catch (error) {
      this.mailer(
        true,
        date,
        `Error while loading the data.\n${error.message}`
      )
      console.error(
        new Error(`Error while loading the data.\n${error.message}`)
      )
      console.error(error)
    }
  }

  mailer (error, date, message = null) {
    let text, subject
    const transporter = nodemailer.createTransport({
      auth: {
        pass: PASSWORD,
        user: EMAIL_SENDER
      },
      service: 'Gmail'
    })

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
      from   : EMAIL_SENDER,
      subject: `ACECOM's Covid app: ${subject}`,
      text   : text,
      to     : `${EMAIL_RECEPTOR[0]}, ${EMAIL_RECEPTOR[1]}`
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if(error) {
        console.error(new Error('Error while sending the email'))
        console.log(true, error)
      }
      else
        console.log(info)
    })
  }
}

export { DataBaseUpdater as Updater }
