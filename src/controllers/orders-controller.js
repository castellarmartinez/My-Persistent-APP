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
        const allOrders = await Order.find({})
        let orderId
        
        if(allOrders.length === 0)
        {
            orderId = '#1'
        }
        else
        {
            let last = allOrders.slice(-1)[0].orderId           
            last ? orderId = '#'.concat(++last) : orderId = '#1'
        }

        const newOrder = 
        {
            orderId,

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

exports.addProductToOrder = async (product, quantityToAdd, order) =>
{
    try
    {
        order.total += quantityToAdd * product.price
        const hasProduct = false

        for(let i = 0; i < order.products.length; i++)
        {
            if(JSON.stringify(order.products[i].product) === JSON.stringify(product._id))
            {
                order.products[i].quantity += quantityToAdd
                hasProduct = true
                break
            }
        }

        if(!hasProduct)
        {
            order.products.push({product: product._id, quantity: quantityToAdd})
        }

        return await order.save()
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.removeProductFromOrder = async (product, quantityToRemove, order) =>
{
    try
    {
        const original = order.products.filter((element) => 
        JSON.stringify(element.product) === JSON.stringify(product._id))
        const originalQuantity = original[0].quantity

        if(originalQuantity < quantityToRemove)
        {
            throw new Error('You cannot remove a quantity greater than the original quantity.')
        }
        else if(originalQuantity === quantityToRemove)
        {
            order.total -= quantityToRemove * product.price

            for(let i = 0; i < order.products.length; i++)
            {
                if(JSON.stringify(order.products[i].product) === JSON.stringify(product._id))
                {
                    order.products.splice(i, 1)
                    break
                }
            }

            return await order.save()
        }
        else // no removal of all units
        {
            const newQuantity = originalQuantity - quantityToRemove
            order.total -= quantityToRemove * product.price
            
            for(let i = 0; i < order.products.length; i++)
            {
                if(JSON.stringify(order.products[i].product) === JSON.stringify(product._id))
                {
                    order.products[i].quantity = newQuantity
                }
            }

            return await order.save()
        }
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.updatePaymentInOrder = async (payment, order) =>
{
    try
    {
        order.paymentMethod = payment._id

        return await order.save()
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.updateOrderState = async (state, order) =>
{
    try
    {
        order.state = state

        return await order.save()
    }
    catch(error)
    {
        return console.log(error.message)
    }
}
