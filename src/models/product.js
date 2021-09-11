const mongoose = require('mongoose')

const Product = mongoose.model('Product',
{
    name:
    {
        type: String,
        required: true
    },

    price:
    {
        type: String,
        required: true
    },

    _id:
    {
        type: String,
        required: true
    }
})

module.exports = Product