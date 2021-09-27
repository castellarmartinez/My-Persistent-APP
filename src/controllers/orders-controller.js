const Order = require('../models/order')
const Payment = require('../models/payment-method')
const Product = require('../models/product')
const User = require('../models/user')

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
        let orders = []

        for(let i = 0; i < result.length; i++)
        {
            const {products, total, paymentMethod, state, owner} = result[i]
            let productList = []

            for(let j = 0; j < products.length; j++)
            {
                const {ID, name, price} = await Product.findById(products[j].product)
                const quantity = products[j].quantity
                productList[j] = {ID, name, price, quantity}
            }

            const {method} = await Payment.findById(paymentMethod)
            const {name, email} = await User.findById(owner)
            orders[i] = {products:productList, total, paymentMethod:method, state, name, email}
        }

        return orders
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.getOrdersByUser = async (orders) =>
{
    try
    {
        let ordersList = []

        for(let i = 0; i < orders.length; i++)
        {
            const {products, total, paymentMethod, state} = orders[i]
            let productList = []

            for(let j = 0; j < products.length; j++)
            {
                const {ID, name, price} = await Product.findById(products[j].product)
                const quantity = products[j].quantity
                productList[j] = {ID, name, price, quantity}
            }

            const {method} = await Payment.findById(paymentMethod)
            ordersList[i] = {products:productList, total, paymentMethod:method, state}
        }

        return ordersList
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

exports.addProductToOrder = async (product, quantity, user) =>
{
    try
    {
        const order = await Order.findOne({owner: user._id, state: "open"})
        order.products.push({product: product._id, quantity})
        order.total += quantity * product.price

        return await order.save()
    }
    catch(error)
    {
        return console.log(error.message)
    }
}