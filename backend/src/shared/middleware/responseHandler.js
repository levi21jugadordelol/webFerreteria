const responseHandler = (req, res, next) => {
  res.success = ({ data = null, message = "OK", status = 200 } = {}) => {
    return res.status(status).json({
      ok: true,
      data,
      message,
    });
  };

  next();
};

export default responseHandler;
