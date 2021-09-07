const User = require('../models/user')

const addUser = (newUser) =>
{
    const user = new User(newUser)
    
    user.save().then(() => 
    {
        console.log(user)
    }).catch((error) => 
    {
        console.log('Error!', error.message)
    })
}

module.exports = {addUser}