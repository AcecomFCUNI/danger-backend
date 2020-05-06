"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataPerDay = void 0;

var _express = _interopRequireDefault(require("express"));

var _dataPerDay = require("../controllers/dataPerDay");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

exports.DataPerDay = router;
const dpd = new _dataPerDay.DataPerDay();
router.post('/', async (req, res) => {
  try {
    let {
      body: {
        args
      }
    } = req;
    const result = await dpd.init(args);
    res.send({
      error: false,
      message: {
        departmentsData: result[1],
        totalData: result[0]
      }
    });
  } catch (error) {
    res.send({
      error: true,
      message: error.message
    });
  }
});