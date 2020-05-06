"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Covid = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _departments = require("../mongo/models/departments");

var _totalData = require("../mongo/models/totalData");

var _cleaner = require("../functions/cleaner");

var _dateGenerator = require("../functions/dateGenerator");

var _queryGenerator = require("../functions/queryGenerator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const URL = process.env.COVID_PERU_CASES;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const PORT = process.env.PORT;

class CovidController {
  async init(args) {
    let {
      date
    } = args;
    const queryBody = (0, _queryGenerator.queryGenerator)(URL, date);
    console.log(queryBody);

    try {
      let response = await (0, _axios.default)({
        url: queryBody
      });
      response = (0, _cleaner.cleaner)(response.data.features);
      date = (0, _dateGenerator.dateGenerator)(date);
      const departments = new _departments.Departments({
        createdAt: date,
        departments: response.departments
      });
      const totalData = new _totalData.TotalData({
        createdAt: date,
        totalCases: response.totalCases,
        totalDeaths: response.totalDeaths || 0,
        totalDiscarded: response.totalDiscarded,
        totalRecovered: response.totalRecovered
      });

      try {
        await Promise.all([departments.save(), totalData.save()]);
        await this.mailer(false, (0, _dateGenerator.dateUTCGenerator)(date));
      } catch (error) {
        try {
          await this.mailer(true, date, `Error while updating the database\n${error.message}`);
        } catch (error) {
          throw new Error('Error while sending the email');
        }

        throw new Error('Error while updating the database');
      }
    } catch (error) {
      try {
        await this.mailer(true, date, `Error while loading the data.\n${error.message}`);
      } catch (error) {
        throw new Error('Error while sending the email');
      }

      throw new Error(`Error while loading the data.\n${error.message}`);
    }
  }

  async mailer(error, date, message = null) {
    const transporter = _nodemailer.default.createTransport({
      auth: {
        pass: PASSWORD,
        user: EMAIL
      },
      service: 'gmail'
    });

    let text, subject;

    if (error) {
      text = message;
      subject = 'Error';
    } else {
      subject = 'Confirmation';
      if (PORT === '4000') // eslint-disable-next-line max-len
        text = `The database was successfully updated with the information of ${date}. It was updated from Anthony's laptop.`;else // eslint-disable-next-line max-len
        text = `The database was successfully updated with the information of ${date}. It was updated from Heroku server.`;
    }

    const mailOptions = {
      from: `ACECOM's Covid app`,
      subject: subject,
      text: text,
      to: 'sluzquinosa@uni.pe, bryan.ve.bv@gmail.com'
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log(error);else console.log(info);
    });
  }

}

exports.Covid = CovidController;