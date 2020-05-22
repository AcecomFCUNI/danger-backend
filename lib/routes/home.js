"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Home = void 0;

var _express = _interopRequireDefault(require("express"));

var _response = require("../functions/response");

var _currentDate = require("../controllers/currentDate");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

exports.Home = router;
const cd = new _currentDate.CurrentDate();
router.get('/', async (req, res) => {
  try {
    const message = 'Welcome to ACECOM\'s Covid-19 API';
    const updatedAt = await cd.getCurrentDate();
    (0, _response.response)(res, null, {
      message,
      updatedAt
    }, 200);
  } catch (error) {
    (0, _response.response)(res, true, 'Internal Server error', 500);
    console.log(error);
  }
});