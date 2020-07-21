module.exports = (res, status, message, data = null) => {
  return res.status(status).send({
    status,
    message,
    data,
  });
};
