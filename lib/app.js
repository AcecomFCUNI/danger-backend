"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = void 0;

var _express = _interopRequireDefault(require("express"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _routes = require("./routes/routes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
exports.app = app;
app.use((0, _morgan.default)('dev'));
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: false
}));
app.use((0, _cookieParser.default)());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
(0, _routes.setRoutes)(app);