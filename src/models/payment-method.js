const mongoose = require('mongoose')

const Payment = mongoose.model('Payment',
{
    method:
    {
        type: String,
        required: true
    },

    option:
    {
        type: Number,
        unique: true,
        required: true
    }
})

module.exports = Payment