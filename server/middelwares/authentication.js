const jwt = require('jsonwebtoken');

//Verifica Token
let verificaToken = (req, res, next )=>{
    let token = req.get('Authorization');
    jwt.verify(token,process.env.KEY,(err, decoded)=>{
        if (err) {
            return res.status(401).json({
                ok:false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

//Verifica AdminRole
let verificaAdminRol = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    }else {
        return res.status(401).json({
            ok:false,
            err:{
                message:'El usuario no es Admin'
            }
        });
    }
}

//Verifica token img
let verificaTokenImg = (req, res, next) => {
    let token = req.query.Authorization;
    jwt.verify(token,process.env.KEY,(err, decoded)=>{
        if (err) {
            return res.status(401).json({
                ok:false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    verificaToken,
    verificaAdminRol,
    verificaTokenImg
}