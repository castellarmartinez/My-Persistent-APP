const Joi = require('joi')
const Product = require('../models/product')

const ProductSchema = Joi.object({
    _id: 
        Joi.string()
        .pattern(new RegExp(/^[DR]{2}\d/))
        .min(3)
        .required(),

    name: 
        Joi.string()
        .alphanum()
        .min(3)
        .max(32)
        .required(),

    price: 
        Joi.number()
        .min(1)
        .required()
})

// Middlewares

const tryValidProduct = async (req, res, next) => 
{
    const newProduct = req.body
    const _id = req.params.id
    const product = 
    {
        _id,
        name:newProduct.name,
        price:newProduct.price
    }
    
    try
    {
        await ProductSchema.validateAsync(product)
        
        next()
    }
    catch(error)
    {
        if(error.message.includes('"_id"'))
        {
            console.log(_id)
            res.status(300).send('The products ID must start with "DR" followed' 
            + ' by at least one number.')
        }
        else if(error.message.includes('"name"'))
        {
            res.status(300).send('You must enter a name with a length between ' 
            + '3-32 characters and only contain letters, numbers and spaces.')
        }
        else if(error.message.includes('"price"'))
        {
            res.status(300).send('The price must be a positive number.')
        }
        else
        {
            res.status(300).send('The fields you are trying to add are not allowed.')
        }
    }
}

const tryProductRegistered = async (req, res, next) => 
{
    const _id =  req.params.id;

    try
    {
        const exist = await Product.findById(_id)

        if(exist)
        {
            res.status(400).send('A product with the same ID already exists.')
        }
        else
        {
            next()
        }
    }
    catch(error)
    {
        res.status(300).send('Unexpected error in registered product.')
    }
}

const tryProductUpdate = async (req, res, next) => 
{
    const _id =  req.params.id;

    try
    {
        const exist = await Product.findById(_id)

        if(!exist)
        {
            res.status(400).send('The product you are trying to update' + 
            '/delete does not exist.')
        }
        else
        {
            next()
        }
    }
    catch(error)
    {
        res.status(300).send('Unexpected error in registered product.')
    }
}

module.exports = {tryProductRegistered, tryValidProduct, tryProductUpdate}