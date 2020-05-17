# Danger Backend

## Prerequisites

You need to have [`Node.js`](https://nodejs.org/en/) and [`yarn`](https://yarnpkg.com/) installed.

You need an `.env` file in order to run this project. It looks like this:

```bash
COVID_PERU_CASES_1=https://geocatmin.ingemmet.gob.pe/arcgis/rest/services/COVIT_PERU_REGION/MapServer/0/query
COVID_PERU_CASES_2=https://covid19.minsa.gob.pe/sala_situacional.asp
EMAIL_SENDER=
EMAIL_RECEPTOR_1=
EMAIL_RECEPTOR_2=
OCR_API_KEY=
MONGO=
PASSWORD=
PORT=
SELECTOR_DATE=svg[class="card"] > g > text > tspan
SELECTOR_TITLE=div[title="Pais"]
SELECTOR_DEPARTMENTS=div[class="pivotTableCellWrap cell-interactive "]
SELECTOR_COVID_CASES=div[class="pivotTableCellWrap cell-interactive tablixAlignRight "]
```

## Setup

In order to install and use this project please run the following commands in your terminal:

```bash
yarn
yarn service
```

This will run the development server, so you will a message as follows:

```bash
yarn run v1.22.4
$ nodemon --exec babel-node -r dotenv/config src/bin/index
[nodemon] 2.0.3
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `babel-node -r dotenv/config src/bin/index`
APP RUNNING AT PORT XXXX
We are connected with the database!
```

## Usage

There are four endpoints implemented:

1. Home: `/` , it has a get method. It is just decorative.

2. CurrentDate: `/currentDate`, it has a get method. There is not parameter required. It will return the last date stored in the database.

    - In case of success you will get the following response:
      ```json
      {
        "error": false,
        "message": {
          "currentDate": "YYYY-MM-DD"
        }
      }
      ```

3. DataPerDay: `/dataPerDay`, it has a post method. This has two different functionalities, according to the payload you send, here are some examples:

    - To get the accumulated data from an specific date from Peru:
    
      ```json
      {
        "args": {
          "date": "YYYY-MM-DD"
        }
      }
      ```

    - In case of success you will get the following response:

      ```json
      {
        "error": false,
        "message": {
          "departmentsData": {
            "departments": [
              {
                "name": "departmentName",
                "totalCases": 111,
                "totalDeaths": 0
              }
            ]
          },
          "totalData": {
            "totalCases": 145,
            "totalDeaths": 0,
            "totalDiscarded": 2930,
            "totalRecovered": null
          }
        }
      }
      ```


4. TotalData: `/totalData`, it has a post method. This method has two different functionalities, according to the payload you send, here are some examples:

    - To get all the data from Peru:
    
      ```json
      {
        "args": {
          "name": "perú"
        }
      }
      ```

    - To get all the data from a department:

      ```json
      {
        "args": {
          "name": "departmentName"
        }
      }
      ```

    - In case of success, for the payload previously, you will get the following responses (respectively):

        1. Data from Peru:

        ```json
        {
          "error": false,
          "message": [
            {
              "createdAt": "YYYY-MM-DD",
              "totalCases": 1, 
              "totalDeaths": 0,
              "totalDiscarded": 154,
              "totalRecovered": 0
            }
          ]
        }
        ```

        2. Data from any department:

        ```json
        {
          "error": false,
          "message": [
            {
              "createdAt": "YYYY-MM-DD",
              "totalCases": 1,
              "totalDeaths": 0
            }
          ]
        }
        ```

### Notes

1. In case of error you will get a generic error as follows (plus a 500 error):
    ```json
    {
      "error": true,
      "message": "Error message"
    }
    ```

2. Be aware of the last 20 lines of the `/src/bin/index.js` file, it has a [`crontab`](https://github.com/kelektiv/node-cron) that will try to update the database at 09:00 pm, we suggest two comment these lines, in order to avoid generating an error if there isn't a `.env` file.

## Authors:

-   **Anthony Luzquiños** - _Initial Work_ - _Database_ - _Deployment_ - _Documentation_ - [AnthonyLzq](https://github.com/AnthonyLzq).
