"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TotalData = void 0;

var _departments = require("../mongo/models/departments");

var _totalData = require("../mongo/models/totalData");

var _dateGenerator = require("../functions/dateGenerator");

class TotalDataFromPeru {
  async init(args) {
    let {
      name
    } = args;
    let data;

    try {
      if (name === 'peru') {
        data = await _totalData.TotalData.find({}, {
          _id: false,
          createdAt: true,
          totalCases: true,
          totalDeaths: true,
          totalDiscarded: true,
          totalRecovered: true
        }).sort({
          createdAt: 1
        });
        data = data.map(element => {
          const date = (0, _dateGenerator.dateUTCGenerator)(element.createdAt);
          return {
            createdAt: date,
            totalCases: element.totalCases,
            totalDeaths: element.totalDeaths,
            totalDiscarded: element.totalDiscarded,
            totalRecovered: element.totalRecovered
          };
        });
      } else {
        name = name.toUpperCase(); // Query to get all the data per departments by day

        data = await _departments.Departments.find({
          'departments.name': name
        }, {
          _id: false,
          createdAt: true,
          departments: {
            $elemMatch: {
              name: name
            }
          }
        }).sort({
          createdAt: 1
        }); // Formatting the data

        data = data.map(element => {
          const date = (0, _dateGenerator.dateUTCGenerator)(element.createdAt);
          return {
            createdAt: date,
            totalCases: element.departments[0].cases,
            totalDeaths: element.departments[0].deaths
          };
        });
      }

      return data;
    } catch (error) {
      throw new Error('Error while getting the data from the database');
    }
  }

}

exports.TotalData = TotalDataFromPeru;