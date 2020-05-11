"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.correctSpelling = void 0;
const correctSpell = {
  'ANCASH': 'ÁNCASH',
  'APURIMAC': 'APURÍMAC',
  'HUANUCO': 'HUÁNUCO',
  'JUNIN': 'JUNÍN',
  'PERU': 'PERÚ',
  'SAN MARTIN': 'SAN MARTÍN'
};

const correctSpelling = args => {
  if (args in correctSpell) return correctSpell[args];
  return args;
};

exports.correctSpelling = correctSpelling;