const Payment = require('../models/payment-method')

const addPaymentMethod = async ({method}) =>
{
    try
    {
        const allMethods = await getPaymentMethods()
        let option

        if(allMethods.length === 0)
        {
            option = 1
        }
        else
        {
            let last = allMethods.slice(-1)[0].option           
            last ? option = ++last : option = 1
        }

        const newMethod = new Payment({method, option})

        return await newMethod.save()
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

const getPaymentMethods = async () =>
{
    try
    {
        const result = await Payment.find({})
        
        const methods = result.map((element) => 
        {
            const {method, option} = element
            return {method, option}
        })

        return methods
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

const updatePaymentMethods = async (option, method) =>
{    
    try
    {
        const methodModified = await Payment.findOneAndUpdate({option}, method)

        return methodModified
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

const deletePaymentMethods = async (option) =>
{
    try
    {
        const method = await Payment.findOneAndDelete({option})
        const allMethods = await getPaymentMethods()

        for(let i = 0; i < allMethods.length; i++)
        {
            await Payment.findOneAndUpdate({option: allMethods[i].option}, {option: i + 1})
        }
        
        return method
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

module.exports = {addPaymentMethod, getPaymentMethods, updatePaymentMethods, deletePaymentMethods}