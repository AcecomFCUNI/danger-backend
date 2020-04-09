const cleaner = response => {
  let result = {}
  let deaths = []
  result.departments = response.map(department => {
    if(department.attributes.MUERTES) deaths.push(department.attributes.MUERTES)
    return {
      name: department.attributes.REGION,
      cases: department.attributes.CONFIRMADOS,
      deaths: department.attributes.MUERTES || 0
    }
  })

  result.totalCases = response[0].attributes.TOTAL_CONFIRMADOS
  result.totalDiscarded = response[0].attributes.TOTAL_DESCARTADOS
  result.totalRecovered = response[0].attributes.RECUPERADOS
  deaths.length > 1
  ? result.totalDeaths = deaths.reduce((total, value) => total + value)
  : result.totalDeaths = deaths[0]
  
  return result
}

export { cleaner }
