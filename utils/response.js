const jsonResponse = (
  res,
  isSuccess,
  message,
  data = null,
  status = undefined
) => {
  const response = {
    success: isSuccess,
    message: message,
    data,
  }

  if (!status) {
    status = isSuccess ? 200 : 400
  }

  return res.status(status).json(response)
}

module.exports = { jsonResponse }
