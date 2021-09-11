const Payment = require('../models/payment-methods')

exports.addPaymentMethod = async ({method}) =>
{
    const methods = await this.getPaymentMethods()
    let last = methods.slice(-1)[0].option
    let _id = 0

    last ? _id = ++last : _id = 1

    const newMethod = new Payment({method, _id})

    try
    {
        return await newMethod.save()
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.getPaymentMethods = async () =>
{
    try
    {
        const result = await Payment.find({})

        const methods = result.map((element) => 
        {
            const {method, _id:option} = element
            return {method, option}
        })

        return methods
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.updatePaymentMethod = async (_id, method) =>
{    
    try
    {
        const methodModified = await Payment.findByIdAndUpdate(_id, method)

        return methodModified
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.deletePaymentMethod = async (_id) =>
{
    try
    {
        const method = await Payment.findByIdAndDelete(_id)
        const methods = await this.getPaymentMethods()
        methods.forEach((element, index) => (element.option = index + 1))
        console.log(methods)
        return method
    }
    catch(error)
    {
        return console.log(error.message)
    }
}