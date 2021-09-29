const mongoose = require('mongoose')

const addressSchema = mongoose.Schema( 
{
    addressList:
    [
        {
            address:
            {
                type: String,
                required: true
            },

            option:
            {
                type: Number,
            }
        }
    ],

    owner:
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})
    
addressSchema.pre('save', async function(next)
{
    const addresses = this
    const length = addresses.addressList.length
    addresses.addressList[length - 1].option = length

    next()
})

const Address = mongoose.model('Address', addressSchema)

module.exports = Address