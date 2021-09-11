require('./db/mongoose')
const express = require('express')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const swaggerOptions = require('./utils/swaggerOptions')

const app = express();
const PORT = 3000;

app.use(express.json());

const swaggerSpecs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs))

app.use('/usuarios', require('./routes/users-route'))
app.use('/productos', require('./routes/products-route'))
app.use('/mediosdepago', require('./routes/payment-route'))
// app.use('/pedidos', require('./routes/pedidosRoute'))

// app.use('/:id/', (req, res) => { res.status(400).send('No se pudo procesar la operación.')})
// app.use('/', (req, res) => { res.status(400).send('No se pudo procesar la operación.')})

app.listen(PORT, () => 
{ 
    console.log(`Server is up on port ${PORT}`) 
})