const basicAuth = require('express-basic-auth');
const {obtenerUsuarios} = require('../models/usuarios');

// Funciones usadas para la creación de los middlewares

function admin(usuario, contrasena){
    const administrador = obtenerUsuarios().some((element) => 
        element.usuario === usuario && element.contrasena === contrasena && element.administrador)

    return administrador;
}

function cliente(usuario, contrasena){
    const cliente = obtenerUsuarios().some((element) => 
        element.usuario === usuario && element.contrasena === contrasena && !element.administrador)

    return cliente;
}


function registrado(usuario, contrasena){
    const cliente = obtenerUsuarios().some((element) => 
        element.usuario === usuario && element.contrasena === contrasena)

    return cliente;
}

// Middlewares
const auth = async (req, res, next) =>
{
    try
    {
        const token = req.header('Authorization')
        const decoded = jwt.verify(token, 'thisismynewcourse')
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user)
        {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    }
    catch(error)
    {
        res.status(401).send('Please authenticate.')
    }
}

const autenticacionAdmin = basicAuth({ authorizer: admin, 
    unauthorizedResponse: 'Debe ingresar como administrador para realizar esta operación.'});

const autenticacionCliente = basicAuth({ authorizer: cliente, 
    unauthorizedResponse: 'Debe ingresar como cliente para realizar esta operación.'});

const autenticacionUsuario = basicAuth({ authorizer: registrado, 
    unauthorizedResponse: 'Debe ser usuario registrado para realizar esta operación.'});

const intentoDeIngreso = basicAuth({ authorizer: registrado, 
    unauthorizedResponse: 'El usuario y/o contraseña no son validos.'});

module.exports = {autenticacionAdmin, autenticacionCliente, autenticacionUsuario, intentoDeIngreso};