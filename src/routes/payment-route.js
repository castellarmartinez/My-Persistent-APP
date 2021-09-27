const express = require('express')
const {addPaymentMethod, getPaymentMethods, updatePaymentMethods, 
    deletePaymentMethods} = require('../controllers/payments-controller');
const { adminAuthentication, userAuthentication } = require('../middlewares/auth');
const { tryMethodUpdate, tryValidMethod } = 
require('../middlewares/payment-validation')

const router = express.Router();

/**
 * @swagger
 * /mediosdepago/agregar:
 *  post:
 *      tags: [Medios de pago]
 *      summary: Agregar un medio de pago a la tienda.
 *      description: Permite agregar un medio de pago a la tienda.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/medio nuevo'
 *      responses:
 *          201:
 *              description: El producto se agregó exitosamentea.
 *          400:
 *              description: El medio de no se pudo agregar.
 *          401:
 *              description: Se necesita permiso para realizar esa accion.
 */

 router.post('/agregar', adminAuthentication, tryValidMethod, async (req, res) => 
 {
     const method = req.body
     const success = await addPaymentMethod(method)
 
     if(success)
     {
         res.status(201).send('The payment method has been added.')
     }
     else
     {
         res.status(500).send('Unable to add the payment method.')
     }
 })

/**
 * @swagger
 * /mediosdepago/lista:
 *  get:
 *      tags: [Medios de pago]
 *      summary: Obtener todos los medios de pago que soporta la tienda.
 *      description: Devuelve una lista con los medios de pago.
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/medios de pago'
 *          401:
 *              description: Se necesita permiso para realizar esa accion
 */

router.get('/lista', userAuthentication, async (req, res) => 
{
    const methods = await getPaymentMethods()

    if(methods)
    {
        res.status(201).json(methods)
    }
    else
    {
        res.status(500).send('Could not access payment methods.')
    }
})

/**
 * @swagger
 * /mediosdepago/modificar/{opcion}:
 *  put:
 *      tags: [Medios de pago]
 *      summary: Modificar un medio de pago.
 *      description: Permite la modificación de los medios de pago.
 *      parameters:
 *      -   name: "opcion"
 *          in: "path"
 *          required: true
 *          type: "integer"
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/medio nuevo'
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *          400:
 *              description: El producto no se pudo modificar por información errónea del mismo.
 *          401:
 *              description: Se necesitan permisos de administrador para realizar esa operación.
 */

router.put('/modificar/:id/', adminAuthentication, tryMethodUpdate, 
tryValidMethod, async (req, res) => 
{
    const update = req.body
    const option = req.params.id
    const success = await updatePaymentMethods(option, update)
    
    if(success)
    {
        res.status(201).send('The product has been updated.')
    }
    else
    {
        res.status(500).send('Could not update the product.')
    }
})

/**
 * @swagger
 * /mediosdepago/eliminar/{opcion}:
 *  delete:
 *      tags: [Medios de pago]
 *      summary: Eliminar un medio de pago.
 *      description: Permite eliminar los medios de pago.
 *      parameters:
 *      -   name: "opcion"
 *          in: "path"
 *          required: true
 *          type: "integer"
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *          400:
 *              description: El producto no se pudo eliminar por información errónea del mismo.
 *          401:
 *              description: Se necesitan permisos de administrador para realizar esa operación.
 */

router.delete('/eliminar/:id/', adminAuthentication, tryMethodUpdate, 
async (req, res) => 
{
    const option = req.params.id
    const success = await deletePaymentMethods(option)
    console.log(success)
    if(success)
    {
        res.status(201).send('The payment method has been deleted.')
    }
    else
    {
        res.status(500).send('Could not delete the payment method.')
    }
})


/**
 * @swagger
 * tags:
 *  name: Medios de pago
 *  description: Seccion de productos
 * 
 * components: 
 *  schemas:
 *      medios de pago:
 *          type: object
 *          properties:
 *              medio:
 *                  type: string
 *              opcion:
 *                  type: integer
 *          example:
 *              medio: Tarjeta de crédito
 *              opcion: 1
 */

/**
 * @swagger
 * tags:
 *  name: Medios de pago
 *  description: Seccion de productos
 * 
 * components: 
 *  schemas:
 *      medio nuevo:
 *          type: object
 *          properties:
 *              medio:
 *                  type: string
 *          example:
 *              medio: Tarjeta de débito
 */

module.exports = router;