"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setRoutes = void 0;

var _home = require("./home");

var _currentDate = require("./currentDate");

var _dataInEachDay = require("./dataInEachDay");

var _dataPerDay = require("./dataPerDay");

var _totalData = require("./totalData");

const routes = [_currentDate.CurrentDate, _dataInEachDay.DataInEachDay, _dataPerDay.DataPerDay, _totalData.TotalData];

const setRoutes = app => {
  app.use('', _home.Home);
  routes.forEach(route => {
    app.use('', route);
  });
};

exports.setRoutes = setRoutes;