const mongoose = require('mongoose')

const Order = mongoose.model('Order',
{
    orderId: 
    {
        type: String,
        required: true
    },

    products: 
    [
        {
            product: 
            {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            
            quantity:
            {
                type: Number,
                required: true
            }
        }
    ],
    
    total:
    {
        type: Number,
        required: true
    },
    
    // address:
    // {
        
        // }, 
        
    paymentMethod:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Payment'
    },

    address:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Adress'
    },
    
    state:
    {
        type: String,
        required: true
    },
    
    owner:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
})

module.exports = Order