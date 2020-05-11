"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DepartmentsModel = void 0;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Departments = new Schema({
  createdAt: Date,
  departments: [{
    cases: Number,
    deaths: Number,
    name: String
  }]
}, {
  collection: 'departments'
});
const DepartmentsModel = mongoose.model('Departments', Departments);
exports.DepartmentsModel = DepartmentsModel;