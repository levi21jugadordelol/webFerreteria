const responseHandler = (req, res, next) => {
  res.success = (data = {}, msg = "OK") => {
    res.json({
      ok: true,
      data,
      msg,
    });
  };

  next();
};

export default responseHandler;
