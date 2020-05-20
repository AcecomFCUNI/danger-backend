"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Updater = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _setImmediateInterval = _interopRequireDefault(require("set-immediate-interval"));

var _departments = require("../mongo/models/departments");

var _totalData = require("../mongo/models/totalData");

var _cleaner = require("./cleaner");

var _dateGenerator = require("./dateGenerator");

var _queryGenerator = require("./queryGenerator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-undef */
// import puppeteer from 'puppeteer'
// import { exec } from 'child_process'
// import { getText } from './imgToText'
const HOME = process.env.HOME;
const URLS = [process.env.COVID_PERU_CASES_1, process.env.COVID_PERU_CASES_2];
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_RECEPTOR = [process.env.EMAIL_RECEPTOR_1, process.env.EMAIL_RECEPTOR_2]; // const selectors = [
//   process.env.SELECTOR_TITLE,
//   process.env.SELECTOR_DEPARTMENTS,
//   process.env.SELECTOR_COVID_CASES,
//   process.env.SELECTOR_DATE
// ]

const PASSWORD = process.env.PASSWORD;
const PORT = process.env.PORT;
const TIME = process.env.TIME;

class DataBaseUpdater {
  async init(args) {
    let response;
    const {
      date
    } = args;
    const queryBody = (0, _queryGenerator.queryGenerator)(URLS[0], date);
    const updater = (0, _setImmediateInterval.default)(async () => {
      try {
        response = await (0, _axios.default)({
          url: queryBody
        });
        response = (0, _cleaner.cleanerForAPI)(response.data.features);
        await this.dataProcess(response, date);
        setTimeout(() => {
          this.mailer(false, null, 'Cleaned the interval.');
          clearTimeout(updater);
        }, 1000);
      } catch (error) {
        this.mailer(true, date, // eslint-disable-next-line max-len
        `The API has not been updated. Trying again in ${parseInt(TIME) / 60000} minutes\n${error.message}`);
        await (0, _axios.default)({
          url: HOME
        }); // eslint-disable-next-line max-len

        console.log(`The API has not been updated. Trying again in ${parseInt(TIME) / 60000} minutes\n${error.message}`);
        console.error(error);
      }
    }, parseInt(TIME));
  }

  async dataProcess(data, date) {
    const departments = new _departments.DepartmentsModel({
      createdAt: (0, _dateGenerator.dateGenerator)(date),
      departments: data.departments
    });
    const totalData = new _totalData.TotalDataModel({
      createdAt: (0, _dateGenerator.dateGenerator)(date),
      totalCases: data.totalCases,
      totalDeaths: data.totalDeaths,
      totalDiscarded: data.totalDiscarded,
      totalRecovered: data.totalRecovered
    });

    try {
      await Promise.all([departments.save(), totalData.save()]);
      this.mailer(false, date);
    } catch (error) {
      this.mailer(true, date, `Error while updating the database.\n${error.message}`);
      console.log(`Error while updating the database.\n${error.message}`);
      console.error(error);
    }
  } // async getPowerBi () {
  //   try {
  //     // Opening the browser in production mode
  //     const browser = await puppeteer.launch({
  //       args: [
  //         '--no-sandbox',
  //         '--disable-setuid-sandbox'
  //       ]
  //     })
  //     // Opening a new page
  //     const page = await browser.newPage()
  //     await page.goto(URLS[1], { waitUntil: 'networkidle2' })
  //     // Making to necessary functions able in the browser
  //     await page.exposeFunction('sleep', this.sleep)
  //     const powerBiUrl = await page.evaluate(async () => {
  //       sleep(1000)
  //       const trueUrl = document.querySelector('iframe').src
  //       return trueUrl
  //     })
  //     await browser.close()
  //     return powerBiUrl
  //   } catch (error) {
  //     throw new Error(
  //       `There was an error trying to get the Power BI URL.\n${error}`
  //     )
  //   }
  // }


  mailer(error, date, message = null) {
    let textMessage, subject;

    const transporter = _nodemailer.default.createTransport({
      auth: {
        pass: PASSWORD,
        user: EMAIL_SENDER
      },
      service: 'Gmail'
    });

    if (error) {
      subject = 'Error';
      textMessage = message;
    } else {
      subject = 'Confirmation';
      if (PORT === '4000') // eslint-disable-next-line max-len
        textMessage = message || `The database was successfully updated with the information of ${date}.\nIt was updated from Anthony's laptop.`;else // eslint-disable-next-line max-len
        textMessage = message || `The database was successfully updated with the information of ${date}.\nIt was updated from Heroku server.`; // if(code === 1) text += '(from the API).'
      // else text += '(from the situational room).'
    }

    const mailOptions = {
      from: EMAIL_SENDER,
      subject: `ACECOM's Covid app: ${subject}`,
      text: textMessage,
      to: `${EMAIL_RECEPTOR[0]}, ${EMAIL_RECEPTOR[1]}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error(new Error(`Error while sending the email\n${error}`));else console.log(info);
    });
  } // async scraper (date) {
  //   try {
  //     // Get the url from the powerBi
  //     const powerBiUrl = await this.getPowerBi()
  //     // Opening the browser in production mode
  //     const browser = await puppeteer.launch({
  //       args: [
  //         '--no-sandbox',
  //         '--disable-setuid-sandbox'
  //       ]
  //     })
  //     // Opening a new page
  //     const page = await browser.newPage()
  //     await page.goto(powerBiUrl, { waitUntil: 'networkidle2' })
  //     // Making to necessary functions able in the browser
  //     await page.exposeFunction('sleep', this.sleep)
  //     await page.exposeFunction('dateGenerator', dateGenerator)
  //     // Setting the viewport to take the screenshot
  //     await page.setViewport({ height: 637, width: 1366 })
  //     const data = await page.evaluate(
  //       async ({ date, selectors }) => {
  //         // Wait until every element is loaded
  //         await sleep(6000)
  //         // Get the server time, if it is not the right time, null is returned
  //         let serverDate = document
  //           .querySelectorAll(selectors[3])[1]
  //           .__data__['value'].split(' ')[0]
  //           .split('/')
  //           .reverse()
  //           .join('-')
  //         serverDate = await window.dateGenerator(serverDate, 1)
  //         if(serverDate <= date) return null
  //         // Get the country element to sort the departments and get the sorted data
  //         const country = document.querySelector(selectors[0])
  //         // Clicking and waiting for the page to change
  //         country.click()
  //         await sleep(3500)
  //         // First group of departments
  //         let fDepartments = Array.from(
  //           document.querySelectorAll(selectors[1])
  //         )
  //         // Current covid cases in Peru
  //         let covidCases = Array.from(document.querySelectorAll(selectors[2]))
  //         // Clicking and waiting for the page to change
  //         country.click()
  //         await sleep(3500)
  //         // Missing departments from the second group
  //         // We only care about the last 4 departments
  //         let mDepartments = Array.from(
  //           document.querySelectorAll(selectors[1])
  //         )
  //         // Getting the value from the elements
  //         fDepartments = fDepartments.map(d => d.innerHTML)
  //         mDepartments = mDepartments.map(d => d.innerHTML)
  //         covidCases = covidCases.map(d => d.innerHTML)
  //         // Concat the departments
  //         const departments = fDepartments.concat(mDepartments.slice(1, 5))
  //         // The data was stored in columns, they have following content:
  //         // 1. Molecular test:
  //         //    covidCases.slice(0, 20).concat(covidCases.slice(100).slice(0, 6))
  //         // 2. Fast test:
  //         //    covidCases.slice(20, 40).concat(covidCases.slice(100).slice(6, 12))
  //         // 3. Total cases:
  //         //    covidCases.slice(40, 60).concat(covidCases.slice(100).slice(12, 18))
  //         // 4. Deaths:
  //         //    covidCases.slice(60, 80).concat(covidCases.slice(100).slice(18, 24))
  //         // 5. Lethality:
  //         //    covidCases.slice(80, 100).concat(covidCases.slice(100).slice(24))
  //         const totalCases = covidCases
  //           .slice(40, 60)
  //           .concat(covidCases.slice(100).slice(12, 18))
  //         const totalDeaths = covidCases
  //           .slice(60, 80)
  //           .concat(covidCases.slice(100).slice(18, 24))
  //         return {
  //           departments,
  //           serverDate,
  //           totalCases,
  //           totalDeaths
  //         }
  //       },
  //       { date: dateGenerator(date), selectors }
  //     )
  //     if(data) {
  //       // Creating a folder to store the image, if the process fails, then we break everything
  //       const folder = await new Promise((resolve, reject) => {
  //         exec(`mkdir ${__dirname}/../images`, error => {
  //           if(error){
  //             console.log('The folder could not be created.')
  //             console.error(error)
  //             reject(false)
  //           }
  //           console.log('Folder created successfully')
  //           resolve('true')
  //         })
  //       })
  //       // If the folder was created, the process continues
  //       if(folder) {
  //         const sampleDir = `${__dirname}/../images/sample.png`
  //         await page.screenshot({
  //           clip: { height: 23, width: 80, x: 769, y: 14 },
  //           path: sampleDir,
  //           type: 'png'
  //         })
  //         // Closing the browser and getting the text from the image
  //         await browser.close()
  //         const sample = await getText(sampleDir)
  //         // The folder is deleted once the text from the image is gotten
  //         const deleted = await new Promise((resolve, reject) => {
  //           exec(`rm -rf ${__dirname}/../images`, error => {
  //             if(error){
  //               console.log('The folder could not be deleted.')
  //               console.error(error)
  //               reject(false)
  //             }
  //             console.log('Image deleted successfully')
  //             resolve(true)
  //           })
  //         })
  //         // If everything went ok, we continue the process, if not, we throw an error
  //         if(deleted)
  //           return {
  //             data: {
  //               departments   : data.departments,
  //               sample        : cleanerForTNumbers(sample),
  //               totalCases    : data.totalCases,
  //               totalDeaths   : data.totalDeaths,
  //               totalRecovered: data.totalRecovered
  //             }
  //           }
  //         else throw new Error('Couldn\'t delete de image folder')
  //       } else {
  //         // Closing the browser anyways
  //         await browser.close()
  //         throw new Error('Couldn\'t create the image folder')
  //       }
  //     } else
  //       throw new Error('The situational room hasn\'t been updated')
  //   } catch (error) {
  //     throw new Error(`There was an error trying to scrap the data.\n${error}`)
  //   }
  // }
  // async sleep (ms) {
  //   return new Promise(resolve => setTimeout(resolve, ms))
  // }


}

exports.Updater = DataBaseUpdater;