const {config} = require('dotenv')

config()

exports.module = 
{
    APP_PORT: process.env.APP_PORT,
    MONGODB_PORT: process.env.MONGODB_PORT,
    REDIS_PORT: process.env.REDIS_PORT,
    MONGODB_HOST: process.env.MONGODB_HOST,
    REDIS_HOST: process.env.REDIS_HOST,
    DB_NAME: process.env.DB_NAME,
    SECRET_PASS: process.env.SECRET_PASS
}