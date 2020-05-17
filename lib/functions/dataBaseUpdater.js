"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Updater = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _puppeteer = _interopRequireDefault(require("puppeteer"));

var _child_process = require("child_process");

var _departments = require("../mongo/models/departments");

var _totalData = require("../mongo/models/totalData");

var _cleaner = require("./cleaner");

var _dateGenerator = require("./dateGenerator");

var _queryGenerator = require("./queryGenerator");

var _imgToText = require("./imgToText");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-undef */
const URLS = [process.env.COVID_PERU_CASES_1, process.env.COVID_PERU_CASES_2];
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_RECEPTOR = [process.env.EMAIL_RECEPTOR_1, process.env.EMAIL_RECEPTOR_2];
const selectors = [process.env.SELECTOR_TITLE, process.env.SELECTOR_DEPARTMENTS, process.env.SELECTOR_COVID_CASES, process.env.SELECTOR_DATE];
const PASSWORD = process.env.PASSWORD;
const PORT = process.env.PORT;

class DataBaseUpdater {
  async init(args) {
    let {
      date
    } = args;
    let code = 1,
        response;
    const queryBody = (0, _queryGenerator.queryGenerator)(URLS[0], date);

    try {
      response = await (0, _axios.default)({
        url: queryBody
      });
      response = (0, _cleaner.cleanerForAPI)(response.data.features);
    } catch (error) {
      code = 2;

      try {
        const {
          data
        } = await this.scraper(date);
        response = (0, _cleaner.cleanerForScraper)(data);
      } catch (error) {
        this.mailer(null, true, date, // eslint-disable-next-line max-len
        `Neither the API nor the situational room were updated.\n${error.message}`); // eslint-disable-next-line max-len

        console.log(`Neither the API nor the situational room were updated.\n${error.message}`);
        console.error(error);
        return;
      }
    }

    date = (0, _dateGenerator.dateGenerator)(date);
    const departments = new _departments.DepartmentsModel({
      createdAt: date,
      departments: response.departments
    });
    const totalData = new _totalData.TotalDataModel({
      createdAt: date,
      totalCases: response.totalCases,
      totalDeaths: response.totalDeaths,
      totalDiscarded: response.totalDiscarded,
      totalRecovered: response.totalRecovered
    });

    try {
      await Promise.all([departments.save(), totalData.save()]);
      this.mailer(code, false, (0, _dateGenerator.dateUTCGenerator)(date));
    } catch (error) {
      this.mailer(null, true, date, `Error while updating the database.\n${error.message}`);
      console.log(`Error while updating the database.\n${error.message}`);
      console.error(error);
    }
  }

  async getPowerBi() {
    try {
      // Opening the browser in production mode
      const browser = await _puppeteer.default.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }); // Opening a new page

      const page = await browser.newPage();
      await page.goto(URLS[1], {
        waitUntil: 'networkidle2'
      }); // Making to necessary functions able in the browser

      await page.exposeFunction('sleep', this.sleep);
      const powerBiUrl = await page.evaluate(async () => {
        sleep(1000);
        const trueUrl = document.querySelector('iframe').src;
        return trueUrl;
      });
      await browser.close();
      return powerBiUrl;
    } catch (error) {
      throw new Error(`There was an error trying to get the Power BI URL.\n${error}`);
    }
  }

  mailer(code, error, date, message = null) {
    let text, subject;

    const transporter = _nodemailer.default.createTransport({
      auth: {
        pass: PASSWORD,
        user: EMAIL_SENDER
      },
      service: 'Gmail'
    });

    if (error) {
      text = message;
      subject = 'Error';
    } else {
      subject = 'Confirmation';
      if (PORT === '4000') // eslint-disable-next-line max-len
        text = `The database was successfully updated with the information of ${date}. It was updated from Anthony's laptop.\n`;else // eslint-disable-next-line max-len
        text = `The database was successfully updated with the information of ${date}. It was updated from Heroku server.\n`;
      if (code === 1) text += 'It was updated from the API.';else text += 'It was updated from the situational room.';
    }

    const mailOptions = {
      from: EMAIL_SENDER,
      subject: `ACECOM's Covid app: ${subject}`,
      text: text,
      to: `${EMAIL_RECEPTOR[0]}, ${EMAIL_RECEPTOR[1]}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error(new Error(`Error while sending the email\n${error}`));else console.log(info);
    });
  }

  async scraper(date) {
    try {
      // Get the url from the powerBi
      const powerBiUrl = await this.getPowerBi(); // Opening the browser in production mode

      const browser = await _puppeteer.default.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }); // Opening a new page

      const page = await browser.newPage();
      await page.goto(powerBiUrl, {
        waitUntil: 'networkidle2'
      }); // Making to necessary functions able in the browser

      await page.exposeFunction('sleep', this.sleep);
      await page.exposeFunction('dateGenerator', _dateGenerator.dateGenerator); // Setting the viewport to take the screenshot

      await page.setViewport({
        height: 637,
        width: 1366
      });
      const data = await page.evaluate(async ({
        date,
        selectors
      }) => {
        // Wait until every element is loaded
        await sleep(6000); // Get the server time, if it is not the right time, null is returned

        let serverDate = document.querySelectorAll(selectors[3])[1].__data__['value'].split(' ')[0].split('/').reverse().join('-');

        serverDate = await window.dateGenerator(serverDate, 1);
        if (serverDate <= date) return null; // Get the country element to sort the departments and get the sorted data

        const country = document.querySelector(selectors[0]); // Clicking and waiting for the page to change

        country.click();
        await sleep(3500); // First group of departments

        let fDepartments = Array.from(document.querySelectorAll(selectors[1])); // Current covid cases in Peru

        let covidCases = Array.from(document.querySelectorAll(selectors[2])); // Clicking and waiting for the page to change

        country.click();
        await sleep(3500); // Missing departments from the second group
        // We only care about the last 4 departments

        let mDepartments = Array.from(document.querySelectorAll(selectors[1])); // Getting the value from the elements

        fDepartments = fDepartments.map(d => d.innerHTML);
        mDepartments = mDepartments.map(d => d.innerHTML);
        covidCases = covidCases.map(d => d.innerHTML); // Concat the departments

        let departments = fDepartments.concat(mDepartments.slice(1, 5)); // The data was stored in columns, they have following content:
        // 1. Recovered patients:
        //    covidCases.slice(0, 20).concat(covidCases.slice(100).slice(0, 6))
        // 2. Fast test:
        //    covidCases.slice(20, 40).concat(covidCases.slice(100).slice(6, 12))
        // 3. Total cases:
        //    covidCases.slice(40, 60).concat(covidCases.slice(100).slice(12, 18))
        // 4. Deaths:
        //    covidCases.slice(60, 80).concat(covidCases.slice(100).slice(18, 24))
        // 5. Lethality:
        //    covidCases.slice(80, 100).concat(covidCases.slice(100).slice(24))

        const totalRecovered = covidCases.slice(0, 20).concat(covidCases.slice(100).slice(0, 6));
        const totalCases = covidCases.slice(40, 60).concat(covidCases.slice(100).slice(12, 18));
        const totalDeaths = covidCases.slice(60, 80).concat(covidCases.slice(100).slice(18, 24));
        return {
          departments,
          serverDate,
          totalCases,
          totalDeaths,
          totalRecovered
        };
      }, {
        date: (0, _dateGenerator.dateGenerator)(date),
        selectors
      });

      if (data) {
        // Creating a folder to store the image, if the process fails, then we break everything
        const folder = await new Promise((resolve, reject) => {
          (0, _child_process.exec)(`mkdir ${__dirname}/../images`, error => {
            if (error) {
              console.log('The folder could not be created.');
              console.error(error);
              reject(false);
            }

            console.log('Folder created successfully');
            resolve('true');
          });
        }); // If the folder was created, the process continues

        if (folder) {
          const sampleDir = `${__dirname}/../images/sample.png`;
          await page.screenshot({
            clip: {
              height: 23,
              width: 80,
              x: 769,
              y: 14
            },
            path: sampleDir,
            type: 'png'
          }); // Closing the browser and getting the text from the image

          await browser.close();
          const sample = await (0, _imgToText.getText)(sampleDir); // The folder is deleted once the text from the image is gotten

          const deleted = await new Promise((resolve, reject) => {
            (0, _child_process.exec)(`rm -rf ${__dirname}/../images`, error => {
              if (error) {
                console.log('The folder could not be deleted.');
                console.error(error);
                reject(false);
              }

              console.log('Image deleted successfully');
              resolve(true);
            });
          }); // If everything went ok, we continue the process, if not, we throw an error

          if (deleted) return {
            data: {
              departments: data.departments,
              sample: (0, _cleaner.cleanerForTNumbers)(sample),
              totalCases: data.totalCases,
              totalDeaths: data.totalDeaths,
              totalRecovered: data.totalRecovered
            }
          };else throw new Error('Couldn\'t delete de image folder');
        } else {
          // Closing the browser anyways
          await browser.close();
          throw new Error('Couldn\'t create the image folder');
        }
      } else throw new Error('The situational room hasn\'t been updated');
    } catch (error) {
      throw new Error(`There was an error trying to scrap the data.\n${error}`);
    }
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}

exports.Updater = DataBaseUpdater;