const mongoose = require('mongoose')

database()

async function database()
{
    const db = await mongoose.connect('mongodb://127.0.0.1:27017/Delilah-Resto')
    
    console.log('Connected to the database:', db.connection.name)
}

// main().catch(err => console.log(err))

// async function main() {
//   const db = await mongoose.connect('mongodb://localhost:27017/Delilah-Resto')
//   console.log(db.connection.name)
// }
