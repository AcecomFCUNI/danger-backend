"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TotalData = void 0;

var _express = _interopRequireDefault(require("express"));

var _totalData = require("../controllers/totalData");

var _response = require("../functions/response");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

exports.TotalData = router;
const td = new _totalData.TotalData();
router.post('/', async (req, res) => {
  const {
    body: {
      args
    }
  } = req;

  try {
    const result = await td.init(args);
    (0, _response.response)(res, false, result, 200);
  } catch (error) {
    (0, _response.response)(res, true, error.message, 500);
  }
});