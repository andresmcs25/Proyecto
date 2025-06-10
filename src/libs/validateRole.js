export function validateRole(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.id_rol_usuario) {
      return res.redirect('/home');
    }
    if (!allowedRoles.includes(user.id_rol_usuario)) {
        return res.redirect('/home');
    }
    next();
  };
}
