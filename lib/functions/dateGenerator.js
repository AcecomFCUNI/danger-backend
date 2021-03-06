"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dateUTCGenerator = exports.dateGenerator = void 0;

const dateGenerator = (date, type = null) => {
  let rightDate = new Date(`${date}T00:00:00.000Z`);
  if (!type) rightDate = new Date(rightDate - 24 * 60 * 60 * 1000);
  return rightDate;
};

exports.dateGenerator = dateGenerator;

const dateUTCGenerator = (date, type = null) => {
  let day = date.getUTCDate().toString();
  let month = (date.getUTCMonth() + 1).toString();
  if (day.length !== 2) day = `0${day}`;
  if (month.length !== 2) month = `0${month}`;
  const result = {
    day,
    month,
    year: date.getUTCFullYear()
  };
  if (type) return result;else return `${result.year}-${result.month}-${result.day}`;
};

exports.dateUTCGenerator = dateUTCGenerator;