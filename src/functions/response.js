const response = (res, error, message, code) => {
  if(message.message)
    res.status(code).send({
      error,
      message  : message.message,
      updatedAt: message.updatedAt
    })
  else
    res.status(code).send({
      error,
      message
    })
}

export { response }
