const Product = require('../models/products')

exports.addProduct = async ({name, price}, _id) =>
{
    // const newProduct = 
    // {
    //     _id,
    //     name,
    //     price
    // }
    // console.log(newProduct)
    const product = new Product({_id, name, price})

    try
    {
        return await product.save()
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.getProducts = async () =>
{
    try
    {
        const products = await Product.find({})
        return products
    }
    catch(error)
    {
        return console.log(error.message)
    }
}