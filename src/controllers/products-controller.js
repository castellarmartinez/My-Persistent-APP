const Product = require('../models/product')

exports.addProduct = async ({name, price}, _id) =>
{
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
        const result = await Product.find({})

        const products = result.map((element) => 
        {
            const {_id:id, name, price} = element
            return {id, name, price}
        })

        return products
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