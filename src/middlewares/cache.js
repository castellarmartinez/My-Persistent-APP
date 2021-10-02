const redisClient = require("../redis/redis-server")

const cache = (req, res, next) =>
{
    redisClient.get('Products', (error, data) =>
    {
        if(error)
        {
            throw error
        }

        if(data)
        {
            const products = JSON.parse(data)
            res.json(products)
        }
        else
        {
            next()
        }
    })
}

module.exports = cache