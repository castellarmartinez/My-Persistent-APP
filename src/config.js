const {config} = require('dotenv')

config()

exports.module = 
{
    PORT: process.env.PORT,
    REDIS_PORT: process.env.REDIS_PORT,
    DB_HOST: process.env.DB_HOST,
    REDIS_HOST: process.env.REDIS_HOST,
    DB_NAME: process.env.DB_NAME,
    SECRET_PASS: process.env.SECRET_PASS
}