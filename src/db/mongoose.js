const mongoose = require('mongoose')
const config = require('../config')

database()

async function database()
{
    try
    {
        const db = await mongoose.connect(`mongodb://${config.default.DB_HOST}:27017/${config.default.DB_NAME}`)
        console.log('Connected to the database:', config.default.DB_NAME)
    }
    catch(error)
    {
        console.log('Error connecting to 127.0.0.1:27017.\n' + 
        'Caused by: Connection refused.')
    }
}

// main().catch(err => console.log(err))

// async function main() {
//   const db = await mongoose.connect('mongodb://localhost:27017/Delilah-Resto')
//   console.log(db.connection.name)
// }
