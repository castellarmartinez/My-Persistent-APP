const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User',
{
    name:
    {
        type: String,
        required: true
    },
    age:
    {
        type: Number,
        required: true,
        default: 18,
        
        validate(value)
        {
            if(value < 0 || value > 127)
            {
                throw new Error('Age must be a positive number less than 127.')
            }
        }
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
    }

})

module.exports = User