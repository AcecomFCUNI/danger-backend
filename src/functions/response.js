const response = (res, error, message, code) => {
  res.status(code).send({
    error,
    message
  })
}

export { response }
