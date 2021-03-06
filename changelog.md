# ACECOM Covid 19

## Version 1.0.0

- Initialize project.

## Version 1.1.0

- Updated:
  - Included [`puppeteer`](https://github.com/puppeteer/puppeteer) in order to scrape the [web page](https://www.worldometers.info/coronavirus/country/peru/) that reports Covid-19 cases from Peru.
  - Changed the main `post` request to a `get` one.

## Version 1.2.0

- Updated:
  - The last [web pag](https://www.worldometers.info/coronavirus/country/peru/) has been replaced for a [new one](https://app.powerbi.com/view?r=eyJrIjoiNGQ2MjA0NzktMTY2NC00NzJmLWE5NGUtODJiZTIwZmY1YzFkIiwidCI6Ijc5MDVjMWZjLTkzM2MtNDUyYS04YjgzLWIyZTU2NDU1ZDE2YSIsImMiOjR9).
  - Now, a response is sended as follows (in case of success):
    ```json
    {
      "success": true,
      "error": false,
      "message": {
        "cities": [
          {
            "name": "city_name",
            "cases": 100,
            "deaths": 20
          }
        ]
      }
    }
    ```
    In case of error:
    ```json
    {
      "success": "false",
      "error": "true",
      "message": "Error while loading the data"
    }
    ```
  - Three functions has been added in order to clean the data and send it to the frontend.
  - The command to run the server has changed from `yarn start` to `yarn service`.

## Version 1.3.0

- Updated:
  - There wasn't necessary to scrape this [page](https://app.powerbi.com/view?r=eyJrIjoiNGQ2MjA0NzktMTY2NC00NzJmLWE5NGUtODJiZTIwZmY1YzFkIiwidCI6Ijc5MDVjMWZjLTkzM2MtNDUyYS04YjgzLWIyZTU2NDU1ZDE2YSIsImMiOjR9), now the information has been gotten from this [API](https://geocatmin.ingemmet.gob.pe/arcgis/rest/services/COVIT_PERU_REGION/MapServer/0/query?f=json&where=FECHA%20BETWEEN%20timestamp%20%272020-04-05%2000%3A00%3A00%27%20AND%20timestamp%20%272020-04-05%2023%3A59%3A59%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=CONFIRMADOS%20desc&outSR=102100).
  - [`puppeteer`](https://github.com/puppeteer/puppeteer) is not used anymore, instead [`axios`](https://github.com/axios/axios) is used to perform a a `GET` request to the API mentioned before.
  - Finally, there was a little modification to the response, in case of success:
    ```json
    {
      "success": true,
      "error": false,
      "message": {
        "departments": [
          {
            "name": "department_name",
            "cases": 100,
            "deaths": 20
          }
        ],
        "totalData": {
          "totalCases": 174,
          "totalDiscarded": 169,
          "totalRecovered": 91,
          "totalDeaths": 7
        }
      }
    }
    ```

## Version 1.4.0

- Updated:
  - All the data from de Covid 19 in Peru was stored in the database of the project.
  - A `get` and `post` for the **`/covid/peru/`** endpoint was implemented.
    - The `post` method is used to get the data from the API and then store it to the database.
    - The `get` method is used to get date-specific data depending of date, so it must be called as **`/covid/peru/:date`**.
  - Changed location of `gitignore` file.

## Version 1.4.1

- Updated:
  - Allow request from everywhere.

## Version 2.0.0
- Added:
  - Frontend branch.
    - Created React App with [`create-react-app`](https://github.com/facebook/create-react-app).
    - [`axios`](https://github.com/axios/axios) was added in order to make [`http`](https://nodejs.org/api/http.html) requests to the backend endpoints.
    - [`material-ui`](https://github.com/mui-org/material-ui) was added in order to stylize the app components.
    - [`mapbox-gl`](https://github.com/mapbox/mapbox-gl-js) was added in order to implement a Peru map using a geojson file.
    - [`chart.js`](https://github.com/chartjs/Chart.js) was added in order to make statistic charts using Peru data that reports Covid-19 cases.

## Version 2.0.1

- Updated: 
  - Minor changes.

## Version 2.0.1a

- HotFix:
  - 'Access-Control-Allow-Headers' repaired.

## Version 2.0.1b

- HotFix:
  - Date repaired.

## Version 2.2.0

- Updated:
  - Implemented endpoint `/api/covid/peru/currentDate`. It returns the last date in the database.

## Version 2.3.0

- Updated:
  - New endpoint that provides the total data per department by day, and the Peru total data per day.

## Version 2.4.0

- Updated:
  - Homogenization of the data.
  - Rebuild of the routes, now `controllers` are been used inside the `src` folder.
  - New rules added to the `.eslintrc.js` file.

## Version 2.5.0:

- Updated:
  - The responses has been updated, in order to be clearly than before, and they are specified in the [docs](https://docs.google.com/document/d/1dLkX-Xc2-zHTslV9eknvi_qgDLdUvDLVzzBwV_mhjM8/edit?usp=sharing).
  - Implemented [`cron`](https://www.npmjs.com/package/cron), to automatize the store in the database.
  - Refactored the some files, the init file is `./bin/index.js` now, instead of `./bin/www`.
  - New rules added to the `.eslintrc.js` file.

## Version 2.5.1:

- Fixed:
  - Time to update the database.

## Version 2.5.2:

- Fixed:
  - Time to update the database.
  - Fixed function to update the database.

## Version 2.5.2a:

- Fixed:
  - Time to update the database by the crontab.

## Version 2.6.0:

- Updated:
  - Implemented [`nodemailer`](https://nodemailer.com/about/) in order to send a confirmation email when the database was updated, or an error email when the database couldn't be updated.

## Version 2.6.0a:

- Fixed:
  - The data from `totalData` endpoint now returns the data sorted ascending.
  - There is a `console.log` when an email is sended.

## Version 2.6.1:

- Fixed:
  - Date when the mail is sended.
- Implemented:
  - A rule to avoid `var`.

## Version 2.6.2:

- Fixed:
  - Date to be saved in the database now has hours, minutes, seconds and milliseconds are set to 0.
- Implemented:
  - New rules to order the keys of an object.

## Version 2.6.2a:

- Fixed:
  - Hour to the update the database from [`Heroku`](https://dashboard.heroku.com/).

## Version 2.7.0:

- Implemented:
  - Location from where that database was updated, Anthony's laptop or Heroku.
  - Capital letter for environment variables.
- Fixed:
  - `dateGenerator` method.

## Version 2.7.1:

- Fixed:
  - Error message that is sended by email.

## Version 3.0.0:

- Full refactorization of the code.
- Implemented:
  - Updated to `ES6`.
  - `babel` is a dev dependence.
  - `lib` folder now contains the project ready to be deployed in production.
  - New rule to single quotes.
  - All the project is inside `src` folder.

## Version 3.1.0:

- Implemented:
  - `home` route.

## Version 4.0.0:

- Implemented:
  - Covid controller is now a function called `databaseUpdater`.
  - Refactorization of some code.
  - Creating ad `Dockerfile` to change the way to deploy.
  - New `lib` folder ready to deploy.

## Version 4.0.0a:

- Fixed:
  - The request to get all the data now it's done using _PERÚ_ rather than _peru_.

## Version 4.0.0b:

- Fixed:
  - The request to get all the data now it's done using _perú_ rather than _PERÚ_.

## Version 4.0.0c:

- Fixed:
  - `Dockerfile` not longer installs `yarn` globally.

## Version 4.1.1:

- Fixed:
  - Updating `lib` folder.

## Version 4.1.1a:

- Fixed:
  - `Dockerfile`.

## Version 4.1.1b:

- Fixed:
  - `Dockerfile`.

## Version 4.1.1c:

- Fixed:
  - `Dockerfile`.

## Version 4.1.2:

- Fixed:
  - Now the request must be using the correct spelling of each peruvian department.

## Version 4.1.2a:

- Fixed:
  - Updating `lib` folder.

## Version 4.2.0:

- Implement:
  - `readme.md` file with the documentation.

## Version 4.3.0:

- Implemented:
  - [`puppeteer`](https://github.com/puppeteer/puppeteer) in order to implement our scrapper.
  - [`ocr-space-api-alt2`](https://github.com/AnthonyLzq/ocr-space-api-alt2) in order to make a request to [ORC.SPACE API](https://ocr.space/ocrapi) to get text from an image.
  - An scrapper that will be used in case the first API is not updated. This scrapper will try to get information from the situational room. Checkout `dataBaseUpdater` function.
  - `imgToText` function, to get the embedded text from the screen shot that the scrapper performs.
  - `cleanerForScraper` function, to clean the data gotten from the situational room.
  . `cleanerForTNumbers` function, to clean the data gotten from the `ìmgToText` function.
  - New rule to ignore comments length.
- Updated:
  - `src/bin/index.js` file, cleaning some useless code.
  - `src/app.js` file, cleaning some useless code.
  - `dateGenerator` function, to avoid time zone.
  - `dataPerDat` controller now implements `dateGenerator` function.
  - [Documentation](./readme.md).

## Version 4.4.0:

  - Removed:
    - The scrapper (and the dependencies need it to do this) because the data from the situational room incomplete.
  - Implemented:
    - `src/routes/routes.js` file, in order to apply the routes to the server.
    - `dataInEachDay` endpoint, to get the daily data.
    - `fromAccumulateToDaily` function, to clean the accumulate data and present it as daily.
    - `process.on` function, in the `bin/index.js` file, in order to handle the unhandled rejection of promises, if there were some.
  - Updated:
    - `.eslintrc.js` file, added some new rules, to avoid unnecessary parenthesis, and to prefer constants.
    - `setInterval` function, to repeat the request to the API in case it fails every 28 minutes.

## Version 4.4.1:

  - Implemented:
    - [`set-immediate-interval`](https://github.com/liketurbo/set-immediate-interval#readme) library, in order to execute the first request to the API without delay.
  - Fixed:
    - The `setInterval` function, now it is executed without delay.
  - Updated:
    - [Documentation](./readme.md).

## Version 4.4.1a:

  - Fixed:
    - Some minor bugs in the `dataBaseUpdater` file that provoked the send of many emails without control.

## Version 4.4.1b:

  - Fixed:
    - Some minor bugs in the `dataBaseUpdater` file that provoked the send of emails without content.

## Version 4.4.2:

  - Updated:
    - HOME environment variable has changed to HOME_URL.
    - Route `/` now displays the current date in the server.
  - TODO:
    - Remove currentDate route in favor of the home content.

## Version 4.4.2a:

  - Fixed:
    - Message of route `/`.
  - TODO:
    - Remove currentDate route in favor of the home content.

## Version 4.4.3:

  - Removed:
    - `currentDate` route.
  - Updated:
    - [`Documentation`](./readme.md)

## Version 4.5.0:

  - Deprecated:
    - Cron job to update the database.

## Version 4.6.0:

  - Updated:
    - Dependencies.

## Version 4.7.0:

  - Updated:
    - Dependencies.

## Version 4.8.0:

  - Updated:
    - Dependencies.
