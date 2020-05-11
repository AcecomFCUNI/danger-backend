"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.response = void 0;

const response = (res, error, message, code) => {
  res.status(code).send({
    error,
    message
  });
};

exports.response = response;