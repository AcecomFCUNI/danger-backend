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
      let date = await _totalData.TotalData.find().sort({
        createdAt: -1
      }).limit(1);
      date = date[0].createdAt;
      const current = (0, _dateGenerator.dateUTCGenerator)(date);
      return current;
    } catch (error) {
      throw new Error('Error while getting the current date from the database');
    }
  }

}

exports.CurrentDate = CurrentDate;