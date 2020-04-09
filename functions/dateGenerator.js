const dateGenerator = date => {
  let rightDate = new Date(date)
  rightDate.setDate(rightDate.getDate() - 1)
  return rightDate
}

export { dateGenerator }