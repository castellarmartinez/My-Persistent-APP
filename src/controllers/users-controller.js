const User = require('../models/user')
const Address = require('../models/address')
const jwt = require('jsonwebtoken')

exports.addUser = async (newUser) =>
{   
    const user = new User(newUser)

    try
    {
        return await user.save()
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.addAddress = async (address, user) =>
{   
    try
    {
       const addresses = await Address.findOne({owner: user._id})

       if(addresses)
       {
           addresses.addressList.push({address})
           return await addresses.save()
       }

       else
       {
           const newAddressList = 
           {
               addressList:
               [
                   {
                       address,
                    }
                ],
                owner: user._id
            }
            
           const newList = new Address(newAddressList)

           return await newList.save()
       }
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.getUsers = async () =>
{
    try
    {
        const result = await User.find({})
        
        const users = result.map((element) => 
        {
            const {name, usermane, email, phone, isAdmin} = element
            return {name, usermane, email, phone, isAdmin}
        })

        return users
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.getAddressList = async (user) =>
{
    try
    {
       const addresses = await Address.findOne({owner: user._id})

       if(addresses)
       {
           const userAddresses = addresses.addressList.map((address) => 
           {
                return {address: address.address, option: address.option}
           })

           return userAddresses
       }

       else
       {
            return 'You do not have addresses saved.'
       }
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.userLogIn = async (user) =>
{   
    try
    {
        const token = jwt.sign({_id: user._id.toString()}, 'RestaurantAPI')
        user.token = token
        await user.save()

        return token
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.userLogOut = async (user) =>
{   
    try
    {
        user.token = ''

        return await user.save()
    }
    catch(error)
    {
        return console.log(error.message)
    }
}

exports.suspendUser = async (email) =>
{   
    try
    {
        const user = await User.findOne({email})

        if(user.isAdmin)
        {
            throw new Error('Admin user cannot be suspended.')
        }

        user.isActive = !user.isActive
        const success = await user.save()
        const message = user.isActive ? 'unsuspended.' : 'suspended.'

        return {success, message}
    }
    catch(error)
    {
        return console.log(error.message)
    }
}