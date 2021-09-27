const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const UsuarioSchema = Joi.object({
    name: 
        Joi.string()
        .pattern(new RegExp(/^[ a-zA-Z]+$/))
        .min(3)
        .max(32)
        .required(),

    email: 
        Joi.string()
        .email(
        {
            minDomainSegments: 2, 
            tlds: 
            { 
                allow: ['com', 'net', 'edu', 'co']
            }
        })
        .required(),

    username: 
        Joi.string()
        .alphanum()
        .min(3)
        .max(32)
        .required(),

    password: 
        Joi.string()
        .min(6)
        .max(32)
        .required(),

    phone: 
        Joi.number()
        .min(1000000)
        .max(999999999999)
        .required(),

    // direccion: Joi.string(),
})

// Middlewares

const tryValidUser = async (req, res, next) => 
{
    const newUser = req.body

    try
    {
        await UsuarioSchema.validateAsync(newUser)

        next()
    }
    catch(error)
    {
        if(error.message.includes('"name"'))
        {
            res.status(300).send('You must enter a name with a length between ' 
            + '3-32 characters only containing letters and spaces.')
        }
        else if(error.message.includes('"email"'))
        {
            res.status(300).send('You must enter a valid email.')
        }
        else if(error.message.includes('"password"'))
        {
            res.status(300).send('You must enter a password with a length ' + 
            'between 6-32 characters.')
        }
        else if(error.message.includes('"username"'))
        {
            res.status(300).send('You must enter an username with a length ' +
            ' between 3-32 characters only containing letters and numbers.')
        }
        else if(error.message.includes('"phone"'))
        {
            res.status(300).send('You must enter a valid phone number.')
        }
        else
        {
            res.status(300).send('The fields you are trying to add are not allowed.')
        }
    }
}

const tryRegisteredUser = async (req, res, next) => 
{
    const {username, email} = req.body

    try
    {
        const emailTaken = await User.findOne({email})
        const usernameTaken = await User.findOne({username})

        if(emailTaken)
        {
            res.status(400).send('Email already in use.')
        }
        else if(usernameTaken)
        {
            res.status(400).send('Username taken.')
        }
        else
        {
            next()
        }
    }
    catch(error)
    {
        res.status(300).send('Unexpected error in registered user.')
    }
}

const tryLogin = async (req, res, next) =>
{ 
    try
    {
        const {email, password} = req.body
        const user = await User.findOne({email})

        if(user)
        {
            const correctPassword = bcrypt.compareSync(password, user.password)

            if(!correctPassword)
            {
                throw new Error('The password you entered is incorrect.')
            }

            if(user.token !== '')
            {
                throw new Error('You are trying to log in again. ' +
                'This is your token, in case you forgot it:\n' + 
                user.token)
            }
    
            req.user = user
            next()
        }
        else
        {
            throw new Error('No user registered with that email.')
        }
    }
    catch(error)
    {
        res.status(401).send(error.message)
    }
}

const tryLogout = async (req, res, next) =>
{
    try
    {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'RestaurantAPI')
        const user = await User.findOne({_id: decoded._id, token: token})

        if(!user)
        {
            throw new Error()
        }


        req.user = user
        next()
    }
    catch(error)
    {
        res.status(401).send('Please authenticate.')
    }
}

module.exports = {tryValidUser, tryRegisteredUser, tryLogin, tryLogout}