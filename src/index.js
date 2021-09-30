require('./db/mongoose')
const express = require('express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const swaggerOptions = require('./utils/swaggerOptions')
const swaggerSpecs = swaggerJsDoc(swaggerOptions)
const helmet = require('helmet')

const app = express();
const PORT = 3000;

app.use(helmet())
app.use(express.json())
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs))

app.use('/users', require('./routes/users-route'))
app.use('/products', require('./routes/products-route'))
app.use('/mediosdepago', require('./routes/payment-route'))
app.use('/pedidos', require('./routes/order-route'))
app.use('/prueba', require('./e'))
// app.use('/:id/', (req, res) => { res.status(400).send('No se pudo procesar la operación.')})
// app.use('/', (req, res) => { res.status(400).send('No se pudo procesar la operación.')})

app.listen(PORT, () => 
{ 
    console.log(`Server is up on port ${PORT}`) 
})

