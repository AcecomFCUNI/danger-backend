"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanerForTNumbers = exports.cleanerForScraper = exports.cleanerForAPI = void 0;
const result = {};
const deaths = [];

const cleanerForAPI = response => {
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

exports.cleanerForAPI = cleanerForAPI;

const cleanerForScraper = response => {
  try {
    let {
      departments
    } = response;
    const {
      sample,
      totalCases,
      totalDeaths // totalRecovered

    } = response;
    const orderer4LastDep = departments.slice(21).reverse();
    departments = departments.slice(0, 22).concat(orderer4LastDep);
    result.departments = [];

    for (let i = 1; i < 26; i++) result.departments.push({
      cases: cleanerForTNumbers(totalCases[i]),
      deaths: cleanerForTNumbers(totalDeaths[i]),
      name: departments[i]
    });

    result.totalCases = cleanerForTNumbers(totalCases[0]);
    result.totalDeaths = cleanerForTNumbers(totalDeaths[0]);
    result.totalDiscarded = sample - result.totalCases; // result.totalRecovered = cleanerForTNumbers(totalRecovered[0])

    return result;
  } catch (error) {
    // eslint-disable-next-line max-len
    throw new Error(`Something went wrong while cleaning the data from the scrapper.\n${error.message}`);
  }
};

exports.cleanerForScraper = cleanerForScraper;

const cleanerForTNumbers = text => {
  if (text) {
    const numPattern = /\d+/g;
    const result = text.match(numPattern).join('');
    return parseInt(result);
  } else return null;
};

exports.cleanerForTNumbers = cleanerForTNumbers;