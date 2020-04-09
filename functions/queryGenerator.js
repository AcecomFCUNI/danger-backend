const queryGenerator = (url, date) => {
  return `${url}?f=json&where=FECHA%20BETWEEN%20timestamp%20%27${date}%2000%3A00%3A00%27%20AND%20timestamp%20%27${date}%2023%3A59%3A59%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=CONFIRMADOS%20desc&outSR=102100`
}

export { queryGenerator }
