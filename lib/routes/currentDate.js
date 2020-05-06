"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CurrentDate = void 0;

var _express = _interopRequireDefault(require("express"));

var _currentDate = require("../controllers/currentDate");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

exports.CurrentDate = router;
const cd = new _currentDate.CurrentDate();
router.get('/', async (req, res) => {
  try {
    const result = await cd.getCurrentDate();
    res.send({
      error: false,
      message: {
        currentDate: result
      }
    });
  } catch (error) {
    res.send({
      error: true,
      message: error.message
    });
  }
});