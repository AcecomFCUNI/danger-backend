"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleaner = void 0;

const cleaner = response => {
  let result = {};
  let deaths = [];

  try {
    result.departments = response.map(department => {
      if (department.attributes.MUERTES) deaths.push(department.attributes.MUERTES);
      return {
        cases: department.attributes.CONFIRMADOS,
        deaths: department.attributes.MUERTES || 0,
        name: department.attributes.REGION
      };
    });
    result.totalCases = response[0].attributes.TOTAL_CONFIRMADOS;
    result.totalDiscarded = response[0].attributes.TOTAL_DESCARTADOS;
    result.totalRecovered = response[0].attributes.RECUPERADOS;
    deaths.length > 1 ? result.totalDeaths = deaths.reduce((total, value) => total + value) : result.totalDeaths = deaths[0];
    return result;
  } catch (error) {
    throw new Error(`The API has not been updated.\n${error.message}`);
  }
};

exports.cleaner = cleaner;