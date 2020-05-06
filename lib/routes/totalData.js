"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TotalData = void 0;

var _express = _interopRequireDefault(require("express"));

var _totalData = require("../controllers/totalData");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

exports.TotalData = router;
const td = new _totalData.TotalData();
router.post('/', async (req, res) => {
  try {
    const {
      body: {
        args
      }
    } = req;
    const result = await td.init(args);
    res.send({
      error: false,
      message: result
    });
  } catch (error) {
    res.send({
      error: true,
      message: error.message
    });
  }
});