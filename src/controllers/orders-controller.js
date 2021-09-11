const Order = require('../models/order')

exports.addOrder = async (_id, user, thisOrder) =>
{
    const order = new Order({_id, name, price})

    try
    {
        return await product.save()
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