const jwt = require('jsonwebtoken');

// Verificar token
let verifyToken = ( req, res, next ) => {
    
    let token = req.get('Authorization'); //extrae el header de la solicitud

    jwt.verify( token, process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El token no es válido',
                }
            });
        }
        req.usuario = decoded.usuario;
        next(); //continúa con la ejecución del servicio
    })

};

//Verificar rol del usuario
let verifyAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if(usuario.role !== 'ADMIN_ROLE'){
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador',
            }
        });
    }
    next();

};

//Verificar el token para imágenes
let verifyTokenImg = ( req, res, next ) => {
    
    let token = req.query.token;
    jwt.verify( token, process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'El token no es válido',
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    })

};

module.exports = {
    verifyToken,
    verifyAdminRole,
    verifyTokenImg
};