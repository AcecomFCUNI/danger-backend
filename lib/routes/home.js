"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Home = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

exports.Home = router;
router.get('/', (req, res) => {
  res.send({
    message: 'Welcome to ACECOM\'s Covid-19 API'
  });
});