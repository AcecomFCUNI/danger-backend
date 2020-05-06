"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connection = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mongoUri = process.env.MONGO;

_mongoose.default.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = _mongoose.default.connection;
exports.connection = connection;