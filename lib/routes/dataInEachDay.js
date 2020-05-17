"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataInEachDay = void 0;

var _express = _interopRequireDefault(require("express"));

var _totalData = require("../controllers/totalData");

var _fromAccumulateToDaily = require("../functions/fromAccumulateToDaily");

var _response = require("../functions/response");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

exports.DataInEachDay = router;
const td = new _totalData.TotalData();
router.post('/dataInEachDay', async (req, res) => {
  const {
    body: {
      args
    }
  } = req;

  try {
    let result = await td.init(args);
    result = (0, _fromAccumulateToDaily.fromAccumulateToDaily)(result, args);
    (0, _response.response)(res, false, result, 200);
  } catch (error) {
    (0, _response.response)(res, true, error.message, 500);
  }
});