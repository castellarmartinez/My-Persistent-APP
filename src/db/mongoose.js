const mongoose = require('mongoose')
const {module: config} = require('../config')
const User = require('../models/user')

database()

async function database()
{
    try
    {
        await mongoose.connect(`mongodb://${config.MONGODB_HOST}:${config.MONGODB_PORT}/${config.DB_NAME}`)

        console.log('Connected to the database:', config.DB_NAME)
        const users = await User.find({isAdmin: true})

        if(users.length === 0)
        {
            await addAdminUser()
        }
    }
    catch(error)
    {
        console.log('Error connecting to ' + config.MONGODB_HOST + ':27017.\n' + 
        'Caused by: Connection refused.')
    }
}

async function addAdminUser()
{
    const admin = new User(
    {
        name: 'Administrator',
        username: 'Admin',
        email: 'admin@delilahresto.com',
        password: '@)T0(Z]p',
        isAdmin: true,
        phone: 5557777
    })

    admin.save()
}