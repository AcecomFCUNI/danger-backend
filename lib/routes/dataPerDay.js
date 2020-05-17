"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataPerDay = void 0;

var _express = _interopRequireDefault(require("express"));

var _dataPerDay = require("../controllers/dataPerDay");

var _response = require("../functions/response");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

exports.DataPerDay = router;
const dpd = new _dataPerDay.DataPerDay();
router.post('/dataPerDay', async (req, res) => {
  try {
    const {
      body: {
        args
      }
    } = req;
    const result = await dpd.init(args);
    (0, _response.response)(res, false, {
      departmentsData: result[1],
      totalData: result[0]
    }, 200);
  } catch (error) {
    (0, _response.response)(res, true, error.message, 500);
  }
});