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
        const users = await User.find({})
        return users
    }
    catch(error)
    {
        return console.log(error.message)
    }
}