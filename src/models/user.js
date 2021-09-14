const mongoose = require('mongoose')

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
        required: true,
        unique: true
    },

    email:
    {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },

    password:
    {
        type: String,
        required: true,
    },

    phone:
    {
        type: Number,
        required: true,
    },

    isActive:
    {
        type: Boolean,
        default: true
    },

    isAdmin:
    {
        type: Boolean,
        default: false
    }
})

module.exports = User