const Product = require('../models/product')

exports.addProduct = async ({name, price}, ID) =>
{
    const product = new Product({ID, name, price})

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
        const result = await Product.find({})

        const products = result.map((element) => 
        {
            const {ID, name, price} = element
            return {ID, name, price}
        })

        return products
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.updateProduct = async (ID, update) =>
{
    try
    {
        return await Product.findOneAndUpdate({ID}, update)
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.deleteProduct = async (ID) =>
{
    try
    {
        const product = await Product.findOneAndDelete({ID})

        return product
    }
    catch(error)
    {
        return console.log(error.message)
    }
}