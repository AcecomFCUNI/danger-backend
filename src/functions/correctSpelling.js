const correctSpell = {
  'ANCASH'    : 'ÁNCASH',
  'APURIMAC'  : 'APURÍMAC',
  'HUANUCO'   : 'HUÁNUCO',
  'JUNIN'     : 'JUNÍN',
  'PERU'      : 'PERÚ',
  'SAN MARTIN': 'SAN MARTÍN'
}

const correctSpelling = args => {
  if(args in correctSpell) return correctSpell[args]

  return args
}

const removeDiacritics = args => {
  const result = args
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()

  return result
}

export { correctSpelling, removeDiacritics }
