const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User',
{
    name:
    {
        type: String,
        required: true
    },

    username:
    {
        type: String,
        required: true
    },

    email:
    {
        type: String,
        required: true,
        lowercase: true,

        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Email is invalid.')
            }
        }
    },

    password:
    {
        type: String,
        required: true,

        validate(value)
        {
            if(value.length < 6 || value.toLowerCase().includes('password'))
            {
                throw new Error('Your passoword must not contain the word ' + 
                '"password" and must have at least 6 characters long.')
            }
        }
    },

    phone:
    {
        type: Number,
        required: true,
    },

    isAdmin:
    {
        type: Boolean,
        default: false
    }
})

module.exports = User