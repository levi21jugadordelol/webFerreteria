const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.rol)) {
      return res.status(403).json({
        ok: false,
        msg: "No autorizado",
      });
    }
    next();
  };
};

export default requireRole;
