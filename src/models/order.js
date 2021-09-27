const mongoose = require('mongoose')

const Order = mongoose.model('Order',
{
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