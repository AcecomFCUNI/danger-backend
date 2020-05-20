"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CurrentDate = void 0;

var _totalData = require("../mongo/models/totalData");

var _dateGenerator = require("../functions/dateGenerator");

class CurrentDate {
  async getCurrentDate() {
    try {
      let date = await _totalData.TotalDataModel.findOne({}, 'createdAt').sort({
        createdAt: -1
      }).limit(1);
      date = date.createdAt;
      date = (0, _dateGenerator.dateUTCGenerator)(date);
      return date;
    } catch (error) {
      console.log(error);
      throw new Error('Error while getting the current date from the database');
    }
  }

}

exports.CurrentDate = CurrentDate;