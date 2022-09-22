exports.success = (msg, data) => {
  return {
    code: 200,
    msg,
    data
  }
}

exports.error = (msg) => {
  return {
    code: 400,
    msg: msg.toString()
  }
}