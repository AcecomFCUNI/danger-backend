"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromAccumulateToDaily = void 0;

const fromAccumulateToDaily = (data, {
  name
}) => {
  const result = [];
  if (name === 'perú') for (let i = data.length - 1; i > 0; i--) result.push({
    cases: data[i].totalCases - data[i - 1].totalCases,
    createdAt: data[i].createdAt,
    deaths: data[i].totalDeaths - data[i - 1].totalDeaths,
    discarded: data[i].totalDiscarded - data[i - 1].totalDiscarded,
    recovered: data[i].totalRecovered - data[i - 1].totalRecovered
  });else for (let i = data.length - 1; i > 0; i--) result.push({
    cases: data[i].totalCases - data[i - 1].totalCases,
    createdAt: data[i].createdAt,
    deaths: data[i].totalDeaths - data[i - 1].totalDeaths
  });
  return result;
};

exports.fromAccumulateToDaily = fromAccumulateToDaily;