const correctSpell = {
  'ANCASH'    : 'ÁNCASH',
  'APURIMAC'  : 'APURÍMAC',
  'HUANUCO'   : 'HUÁNUCO',
  'JUNIN'     : 'JUNÍN',
  'PERU'      : 'PERÚ',
  'SAN MARTIN': 'SAN MARTÍN'
}

const correctSpelling = args => {
  if(args in correctSpell)
    return correctSpell[args]

  return args
}

export { correctSpelling }