const mongoose = require('mongoose')

const Order = mongoose.model('Order',
{
    method:
    {
        type: String,
        required: true
    },

    _id:
    {
        type: Number,
        required: true
    }
})

module.exports = Order