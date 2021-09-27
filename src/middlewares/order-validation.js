const Joi = require("joi");
const Order = require("../models/order")
const Payment = require("../models/payment-method")

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


function estadoAdmin(estado){
    let estadoValido = false;

    switch(estado){
        case 'preparando':
        case 'enviando':
        case 'cancelado':
        case 'entregado':
            estadoValido = true;
            break;
        default:
            break;
    }

    return estadoValido;
}

function estadoCliente(estado){
    let estadoValido = false;

    switch(estado){
        case 'confirmado':
        case 'cancelado':
            estadoValido = true;
            break;
        default:
            break;
    }

    return estadoValido;
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
    const userOrders = await Order.find({owner: user._id})
    const hasOpenOrder = userOrders.some((order) => order.state === 'open')

    if(userOrders.length > 0 && hasOpenOrder)
    {
        res.status(401).send('You can\'t have more than one open order.\n' +
        'Close or cancel that order to be able to create another order.')
    }
    else
    {
        next()
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

const puedeEditarPedido = (req, res, next) => {
    const usuario = req.auth.user;

    if(pedidoAbierto(usuario)){
        next()
    }
    else{
        res.status(403).send('No tiene ningún pedido abierto (nuevo) que pueda modificar.')
    }
}

const estadoValidoAdmin = (req, res, next) => {
    const {estado} = req.query;

    if(estadoAdmin(estado)){
        next();
    }
    else{
        res.status(400).send('No se ha podido cambiar el estado.\n' +
         'Verifique que el estado sea válido.')
    }
}

const estadoValidoCliente = (req, res, next) => {
    const {estado} = req.query;

    if(estadoCliente(estado)){
        next();
    }
    else{
        res.status(400).send('No se ha podido cambiar el estado.\n' +
         'Verifique que el estado sea válido.')
    }
}

const ordenExiste = (req, res, next) => {
    const {ordenId} = req.query;

    if(orden(ordenId)){
        next();
    }
    else{
        res.status(403).send('El pedido que intenta modificar no existe.')
    }
}

const adicionValida = (req, res, next) => {
    const {unidades} = req.query;

    if(unidadesEnteroMayorACero(unidades)){
        next()
    }
    else{
        res.status(400).send('La unidades a agregar deben ser mayor a cero.');
    }
}

const eliminacionValida = (req, res, next) => {
    const idProducto = req.params.id;
    const user = req.auth.user;
    const {unidades} = req.query;
    const producto = obtenerEsteProducto(idProducto);
    const pedido = obtenerEstePedido(user);

    if(!unidadesEnteroMayorACero(unidades)){
        res.status(400).send('La unidades a agregar deben ser mayor a cero.');
    }
    else if(!eliminarValido(pedido, producto)){
        res.status(405).send('No tiene ningún pedido abierto con el producto que intenta eliminar.');
    }
    else{
        next();
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

module.exports = {tryOpenOrder, tryValidOrder, tryMadeOrders}