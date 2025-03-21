function responseHandler(req, res, next) {
  res.send({
    success: true,
    message:res.message,
    data:res.data,
  });
}

module.exports.responseHandler = responseHandler;
