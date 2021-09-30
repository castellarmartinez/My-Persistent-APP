const Joi = require('joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { bearerAuth } = require('./auth')

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
        .required()
})

// Functions to use in middlewares

function invalidUserError(message)
{
    if(message.includes('"name"'))
    {
        res.status(300).send('You must enter a name with a length between ' 
        + '3-32 characters only containing letters and spaces.')
    }
    else if(message.includes('"email"'))
    {
        res.status(300).send('You must enter a valid email.')
    }
    else if(message.includes('"password"'))
    {
        res.status(300).send('You must enter a password with a length ' + 
        'between 6-32 characters.')
    }
    else if(message.includes('"username"'))
    {
        res.status(300).send('You must enter an username with a length ' +
        ' between 3-32 characters only containing letters and numbers.')
    }
    else if(message.includes('"phone"'))
    {
        res.status(300).send('You must enter a valid phone number.')
    }
    else
    {
        res.status(300).send('The fields you are trying to add are not allowed.')
    }
}

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
        invalidUserError(error.message)
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
            res.status(400).send('Username already in use.')
        }
        else
        {
            next()
        }
    }
    catch(error)
    {
        res.status(300).send('Unexpected error in user registration.')
    }
}

const tryLogin = async (req, res, next) =>
{ 
    try
    {
        const {email: emailEntered, password: passwordEntered} = req.body
        const user = await User.findOne({email: emailEntered})

        if(user)
        {
            const correctPassword = bcrypt.compareSync(passwordEntered, user.password)

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
        const user = await bearerAuth(req)

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

const tryValidAddress = (req, res, next) =>
{
    const {address} = req.body

    if(address)
    {
        next()
    }
    else
    {
        res.status(401).send('You must provide an address.')
    }
}

const trySuspend = async (req, res, next) =>
{
    const {email} = req.body

    try
    {
        const user = await User.findOne({email})

        if(!user)
        {
            res.status(401).send('An user with that emain is not registered.')
        }
        else if(user.isAdmin)
        {
            res.status(401).send('Admin users cannot be suspended.')
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

module.exports = {tryValidUser, tryRegisteredUser, tryLogin, tryLogout, 
    tryValidAddress, trySuspend}