"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.response = void 0;

const response = (res, error, message, code) => {
  if (message.message) res.status(code).send({
    error,
    message: message.message,
    updatedAt: message.updatedAt
  });else res.status(code).send({
    error,
    message
  });
};

exports.response = response;