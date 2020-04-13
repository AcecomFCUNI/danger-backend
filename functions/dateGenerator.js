const dateGenerator = date => {
  let rightDate = new Date(date)
  rightDate.setDate(rightDate.getDate() - 1)
  return rightDate
}

const dateUTCGenerator = date => {
  let day = date.getUTCDate().toString()
  let month = (date.getUTCMonth() + 1).toString()

  if(day.length !== 2) day = `0${day}`
  if(month.length !== 2) month = `0${month}`

  const result = {
    day,
    month,
    year: date.getUTCFullYear()
  }

  return `${result.year}-${result.month}-${result.day}`
}

export { dateGenerator, dateUTCGenerator }