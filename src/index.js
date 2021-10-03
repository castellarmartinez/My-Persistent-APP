require('./db/mongoose')
require('./redis/redis-server')
const express = require('express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const swaggerOptions = require('./utils/swaggerOptions')
const helmet = require('helmet')
const {module: config} = require('./config')
const swaggerSpecs = swaggerJsDoc(swaggerOptions)

const app = express()
const PORT = config.APP_PORT || 3000

app.use(helmet())
app.use(express.json())
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs))

app.use('/users', require('./routes/users-route'))
app.use('/products', require('./routes/products-route'))
app.use('/payment', require('./routes/payment-route'))
app.use('/orders', require('./routes/order-route'))

app.listen(PORT, () => 
{ 
    console.log(`Server is up on port ${PORT}`) 
})

module.exports = app
