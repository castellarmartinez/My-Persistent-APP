const Order = require('../models/order')
const Product = require('../models/product')


exports.addOrder = async (productId, user, thisOrder) =>
{
    const {quantity, state, payment} = thisOrder
    const thisProduct = await Product.findById(productId)

    const newOrder = 
    {
        products:
        [
            {
                product: productId,
                quantity
            }
        ],

        paymentMethod: payment,

        total: thisProduct.price * quantity,

        state,

        owner: user._id
    }

    const order = new Order(newOrder)
    // return true
    try
    {
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