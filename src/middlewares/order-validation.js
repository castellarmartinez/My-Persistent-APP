const Joi = require("joi");
const Order = require("../models/order")
const Payment = require("../models/payment-method");
const Product = require("../models/product");

const OrderSchema = Joi.object(
{
    payment: 
        Joi.number()
        .min(1)
        .required(),
        // .max(32)
        // .required(),
    quantity:
        Joi.number()
        .min(1)
        .required(),

    state:
        Joi.string().
        valid('open', 'closed').
        required()
})

// Funciones usadas para crear los middlewares

async function openOrder(user)
{
    const userOrders = await Order.find({owner: user._id, state: 'open'})
    // const hasOpenOrder = userOrders.some((order) => order.state === 'open')
    // const open = userOrders.length > 0 && hasOpenOrder

    return userOrders
}

function datosValidos(datosIngresados){
    const {unidades, direccion, pago, estado} = datosIngresados;
    const numeroDeParametros = Object.keys(datosIngresados).length;
    const parametrosValidos = unidades && direccion && pago && estado;

    if(parametrosValidos && numeroDeParametros === 4){
        const datosValidos = unidadesEnteroMayorACero(unidades) && medioDePago(pago) &&
        estadoNuevoPedido(estado);
        
        return datosValidos;
    }
    else{
        return false;
    }
}

function pedidoAbierto(usuario){
    const abierto = obtenerPedidos().some((element) => 
        (element.usuario === usuario && element.estado === 'nuevo'));

    return abierto;
}

function stateAdmin(state)
{
    let stateValid = false;

    switch(state)
    {
        case 'preparing':
        case 'shipping':
        case 'cancelled':
        case 'delivered':
            stateValid = true
            break
        default:
            break
    }

    return stateValid;
}

function stateCustomer(state)
{
    let stateValid = false;

    switch(state)
    {
        case 'confirmed':
        case 'cancelled':
            stateValid = true
            break
        default:
            break
    }

    return stateValid
}

function estadoNuevoPedido(estadoIngresado){
    let valido = false;

    switch(estadoIngresado){
        case 'nuevo':
        case 'confirmado':
            valido = true;
            break;
        default:
            break;
    }

    return valido;
}

function orden(ordenIngresada){
    const existe = obtenerPedidos().some((element) => 
        (element.orden === ordenIngresada));

    return existe;
}

function unidadesEnteroMayorACero(unidades){
    const valido = unidades % 1 === 0 && unidades > 0;

    return valido;
}

function medioDePago(pago){
    const medio = obtenerEsteMedio(pago);

    return medio;
}

function eliminarValido(pedido, producto){
    const indice = pedido.descripcion.search(producto.nombre);
    const valido = indice !== -1;

    return valido;
}

// Middlewares

const tryOpenOrder = async (req, res, next) => 
{
    const user = req.user
    const order = await Order.findOne({owner: user._id, state: 'open'})

    if(order)
    {
        res.status(401).send('You can\'t have more than one open order.\n' +
        'Close or cancel that order to be able to create another order.')
    }
    else
    {
        next()
    }
}

const tryEditOrder = async (req, res, next) => 
{
    const user = req.user
    const order = await Order.findOne({owner: user._id, state: 'open'})

    if(order)
    {
        req.order = order
        next()
    }
    else
    {
        res.status(403).send('You don\'t have any open order you can edit.')
    }
}

const tryValidOrder = async (req, res, next) => 
{
    const newOrder = req.body

    try
    {
        await OrderSchema.validateAsync(newOrder)
        const {payment} = newOrder
        const methodExist = await Payment.findOne({option: payment})

        if(methodExist)
        {
            next()
        }
        else
        {
            throw new Error('"payment"')
        }
    }
    catch(error)
    {
        if(error.message.includes('"payment"'))
        {
            res.status(401).send('You need to use an existing ' +
            'payment method (payment).')
        }
        else if(error.message.includes('"state"'))
        {
            res.status(401).send('Only "open" and "closed" are valid states' +
            ' for new orders.')
        }
        else if(error.message.includes('"quantity"'))
        {
            res.status(401).send('The product quantity must be greater than 0.')
        }
        else
        {
            res.status(401).send(error.message)
        }
    }
}

const tryMadeOrders = async (req, res, next) => 
{
    const user = req.user
    const orders = await Order.find({owner: user._id})

    if(orders.length > 0)
    {
        req.orders = orders
        next()
    }
    else
    {
        res.status(403).send('You have not ordered anything.')
    }
}

const tryValidAddition = async (req, res, next) => 
{
    const {unidades: quantity} = req.query;
    const validQuantity = quantity % 1 === 0 && quantity > 0

    if(validQuantity)
    {
        const user = req.user
        next()
    }
    else
    {
        res.status(400).send('The units to add must be greater than 0.')
    }
}

const tryValidElimination = async (req, res, next) =>
{
    const ID = req.params.id
    const user = req.user
    const {unidades: quantity} = req.query
    const validQuantity = quantity % 1 === 0 && quantity > 0

    if(!validQuantity)
    {
        res.status(400).send('The units to remove must be greater than 0.')
    }
    else
    {
        const product = await Product.findOne({ID})
        const order = await Order.findOne({owner: user._id, state: "open", 
        "products.product": product._id})
    
        if(order)
        {
            req.order = order
            next()
        }
        else
        {
            res.status(405).send('You do not have an open order with the product '
            + 'you are trying to remove.')
        }
    }
}

const tryValidStateCustomer = (req, res, next) => 
{
    const {state} = req.query

    if(stateCustomer(state))
    {
        next()
    }
    else
    {
        res.status(400).send('The state could not be changed.\n' +
         'Only "confirmed" and "cancelled" are valid.')
    }
}

const tryValidStateAdmin = (req, res, next) => 
{
    const {state} = req.query

    if(stateAdmin(state))
    {
        next()
    }
    else
    {
        res.status(400).send('The state could not be changed.\n' +
        'Only "preparing", "shipping", "cancelled" and "delivered" are valid.')
    }
}

const tryOrderExist = async (req, res, next) => 
{
    const {orderId} = req.query
    const order = await Order.findOne({orderId})

    if(order)
    {
        req.order = order
        next()
    }
    else{
        res.status(403).send('The order you are trying to edit does not exist.')
    }
}

const direccionValida = (req, res, next) => {
    const {direccion} = req.query;
    const parametrosValidos = direccion;

    if(parametrosValidos){
        next()
    }
    else{
        res.status(400).send('La direccion a la que intenta cambiar no es válida.');
    }
}

module.exports = {tryOpenOrder, tryValidOrder, tryMadeOrders, 
    tryEditOrder, tryValidAddition, tryValidElimination, tryValidStateCustomer,
    tryValidStateAdmin, tryOrderExist}