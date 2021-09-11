const User = require('../models/user')

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