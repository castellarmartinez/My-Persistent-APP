const mongoose = require('mongoose')

database()

async function database()
{
    try
    {
        const db = await mongoose.connect('mongodb://127.0.0.1:27017/Delilah-Resto')
        console.log('Connected to the database:', db.connection.name)
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
