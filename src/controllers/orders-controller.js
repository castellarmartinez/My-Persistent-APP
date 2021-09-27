const Order = require('../models/order')
const Payment = require('../models/payment-method')
const Product = require('../models/product')

exports.addOrder = async (ID, user, thisOrder) =>
{
    // return true
    try
    {
        const {quantity, state, payment} = thisOrder
        const thisProduct = await Product.findOne({ID})
        const thisPayment = await Payment.findOne({option: payment})

        const newOrder = 
        {
            products:
            [
                {
                    product: thisProduct._id,
                    quantity
                }
            ],

            paymentMethod: thisPayment._id,

            total: thisProduct.price * quantity,

            state,

            owner: user._id
        }

        const order = new Order(newOrder)

        return await order.save()
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.getOrders = async () =>
{
    try
    {
        const result = await Order.find({})

        const orders = result.map((element) => 
        {
            const {name, usermane, email, phone, address,
            description, price, method, order, state} = element
            return {name, usermane, email, phone, address,
                description, price, method, order, state}
        })

        return orders
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.getOrdersByUser = async () =>
{
    try
    {
        const result = await Order.findById({})

        const orders = result.map((element) => 
        {
            const {name, usermane, email, phone, address,
            description, price, method, order, state} = element
            return {name, usermane, email, phone, address,
                description, price, method, order, state}
        })

        return orders
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.updateProduct = async (_id, update) =>
{
    try
    {
        const product = await Product.findByIdAndUpdate(_id, update)

        return product
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.deleteProduct = async (_id) =>
{
    try
    {
        const product = await Product.findByIdAndDelete(_id)

        return product
    }
    catch(error)
    {
        return console.log(error.message)
    }
}