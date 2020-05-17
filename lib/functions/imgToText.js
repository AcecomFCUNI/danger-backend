"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getText = void 0;

var _ocrSpaceApiAlt = _interopRequireDefault(require("ocr-space-api-alt2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const OCR_API_KEY = process.env.OCR_API_KEY;
const options = {
  apikey: `<${OCR_API_KEY}>`,
  filetype: 'png'
};

const getText = async path => {
  try {
    let result = await (0, _ocrSpaceApiAlt.default)(path, options);
    return result;
  } catch (error) {
    throw new Error(`There was an error trying to get text from the image.\n${error.message}`);
  }
};

exports.getText = getText;