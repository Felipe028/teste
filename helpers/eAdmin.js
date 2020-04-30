module.exports = {
  eAdmin: function(req, res, next){
    //"req.isAuthenticated()" = Se tiver Authenticando
    if(req.isAuthenticated() && req.user.eAdmin == 1){//"req.user.eAdmin == 1" = Se for administrador
      return next();
    }

    req.flash("error_msg", "Você não não tem permissão para acessar esta página!")
    res.redirect("/")
  }
}
