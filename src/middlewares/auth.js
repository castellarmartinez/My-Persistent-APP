const User = require('../models/user')
const jwt = require('jsonwebtoken')

// Funciones usadas para la creación de los middlewares

async function bearerAuth(req) 
{
    if(req.header('Authorization'))
    {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'RestaurantAPI')
    
        return await User.findOne({_id: decoded._id, token: token})
    }
}

const adminAuthentication = async (req, res, next) =>
{
    try
    {
        const user = await bearerAuth(req)

        if(!user)
        {
            throw new Error('Please authenticate.')
        }
        else if(!user.isAdmin)
        {
            throw new Error('You need admin privileges for this operation.')
        }
        else
        {
            next()
        }
    }
    catch(error)
    {
        res.status(401).send(error.message)
    }
}

const customerAuthentication = async (req, res, next) =>
{
    try
    {
        const user = await bearerAuth(req)

        if(!user)
        {
            throw new Error('Please authenticate.')
        }
        else if(user.isAdmin)
        {
            throw new Error('Administrators cannot perform this operation.')
        }
        else
        {
            req.user = user
            next()
        }
    }
    catch(error)
    {
        res.status(401).send(error.message)
    }
}


const userAuthentication = async (req, res, next) =>
{
    try
    {
        const user = await bearerAuth(req)

        if(!user)
        {
            throw new Error('Please authenticate.')
        }

        next()
    }
    catch(error)
    {
        res.status(401).send(error.message)
    }
}

module.exports = {adminAuthentication, customerAuthentication, userAuthentication}