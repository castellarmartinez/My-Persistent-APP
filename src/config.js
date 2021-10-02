const {config} = require('dotenv')

config()

exports.module = 
{
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    SECRET_PASS: process.env.SECRET_PASS
}