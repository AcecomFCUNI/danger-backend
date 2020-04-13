# Acecom Covid 19

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
  - New rules added to `.eslintrc.js` file
