const mongoose = require('mongoose')

const Payment = mongoose.model('Payment',
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

module.exports = Payment