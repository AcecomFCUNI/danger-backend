"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TotalDataModel = void 0;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TotalData = new Schema({
  createdAt: Date,
  totalCases: Number,
  totalDeaths: Number,
  totalDiscarded: Number,
  totalRecovered: Number
}, {
  collection: 'totalData'
});
const TotalDataModel = mongoose.model('TotalData', TotalData);
exports.TotalDataModel = TotalDataModel;