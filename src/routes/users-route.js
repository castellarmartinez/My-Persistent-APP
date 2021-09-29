const express = require('express')
const {addUser, getUsers, userLogIn, userLogOut, suspendUser, addAddress, 
    getAddressList} = require('../controllers/users-controller')
const { adminAuthentication, customerAuthentication } = require('../middlewares/auth')
const {tryRegisteredUser, tryValidUser, tryLogin, tryLogout} = 
require('../middlewares/user-validation')

const router = express.Router()

/**
 * @swagger
 * /usuarios/registro:
 *  post:
 *      tags: [Usuarios]
 *      summary: Registrar un nuevo usuario sin privilegios de administrador.
 *      description: Permite el registro de nuevos usuarios.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/registro'
 *      responses:
 *          "200":
 *              description: Registro exitoso.
 *          "400":
 *              description: Los datos de registro no son validos.
 *          "405":
 *              description: El username y/o email ya se encuentran registrados.
 */

 router.post('/registro', tryValidUser, tryRegisteredUser, async (req, res) => 
 {
     const newUser = req.body
     const success = await addUser(newUser)
 
     if(success)
     {
         res.status(201).send('Congratulations!\nYour account has been successfully'
         + ' created.') 
     }  
     else
     {
         res.status(500).send('Your account could not be created.')
     }
 })
 
/**
 * @swagger
 * /usuarios/login:
 *  post:
 *      tags: [Usuarios]
 *      summary: Ingreso a todos los usuarios registrados.
 *      description: La da acceso a un usuario.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/login'
 *      responses:
 *          "200":
 *              description: El usuarion ingresó exitosamente.
 *          "500":
 *              description: El usuario y/o contraseña no son validos.
 */

router.post('/login', tryLogin, async (req, res) => 
{
    const user = req.user
    const token = await userLogIn(user)

    res.status(200).send(`You are now logged in. Your token for this session:
    ${token}`) 
})

/**
 * @swagger
 * /usuarios/logout:
 *  post:
 *      tags: [Usuarios]
 *      summary: Obtener las cuentas registradas (nombre, usuario, administrador).
 *      description: Devuelve una lista con los usuarios registrados.
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/logout'
 *          401:
 *              description: Se necesita permiso para realizar esa accion
 */

router.post('/logout', tryLogout, async (req, res) => 
{
    const user = req.user
    const success = await userLogOut(user)

    if(success)
    {
        res.status(201).send('Logged out successfully.')
    }
    else
    {
        res.status(500).send('Unable to log out.')
    }
})

/**
 * @swagger
 * /usuarios/addAddress:
 *  post:
 *      tags: [Usuarios]
 *      summary: Ingreso a todos los usuarios registrados.
 *      description: La da acceso a un usuario.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/addAddress'
 *      responses:
 *          "200":
 *              description: El usuarion ingresó exitosamente.
 *          "500":
 *              description: El usuario y/o contraseña no son validos.
 */

 router.post('/addAddress', customerAuthentication, async (req, res) => 
 {
    const {address} = req.body
    const user = req.user
    const success = await addAddress(address, user)

    if(success)
    {
        res.status(201).send('You have added a new address.')
    }
    else
    {
        res.status(201).send('Unable to add address.')
    }
 })

/**
 * @swagger
 * /usuarios/lista:
 *  get:
 *      tags: [Usuarios]
 *      summary: Obtener las cuentas registradas (nombre, usuario, administrador).
 *      description: Devuelve una lista con los usuarios registrados.
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/lista de usuarios'
 *          401:
 *              description: Se necesita permiso para realizar esa accion
 */

router.get('/lista', adminAuthentication, async (req, res) => 
{
    const users = await getUsers()

    if(users)
    {
        res.status(201).json(users)
    }
    else
    {
        res.status(500).send('Could not access registered users.')
    }
})

/**
 * @swagger
 * /usuarios/getAddresses:
 *  get:
 *      tags: [Usuarios]
 *      summary: Obtener las cuentas registradas (nombre, usuario, administrador).
 *      description: Devuelve una lista con los usuarios registrados.
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/address list'
 *          401:
 *              description: Se necesita permiso para realizar esa accion
 */

router.get('/getAddresses', customerAuthentication, async (req, res) => 
{
    const user = req.user
    const users = await getAddressList(user)

    if(users)
    {
        res.status(201).json(users)
    }
    else
    {
        res.status(500).send('Could not access registered users.')
    }
})

/**
 * @swagger
 * /usuarios/suspend:
 *  put:
 *      tags: [Usuarios]
 *      summary: Suspender un usuario.
 *      description: Permite la modificación de los productos en la tienda.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/suspend user'
 *      responses:
 *          200:
 *              description: Operación exitosa.
 *          400:
 *              description: El producto no se pudo agregar por información errónea del mismo.
 *          401:
 *              description: Se necesitan permisos de administrador para realizar esa operación.
 */

router.put('/suspend', adminAuthentication, async (req, res) => 
{
    const {email} = req.body
    const {success, message} = await suspendUser(email)

    if(success)
    {
        res.status(201).send('The user has been ' + message) 
    }  
    else
    {
        res.status(500).send('Could not suspend user.')
    }
})

/**
 * @swagger
 * tags:
 *  name: Usuarios
 *  description: Seccion de usuarios
 * 
 * components: 
 *  schemas:
 *      lista de usuarios:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *              usuario:
 *                  type: string
 *              administrador:
 *                  type: boolean
 *          example:
 *              nombre: Arnedes Olegario
 *              nombre de usuario: arneolegario
 *              administrador: false
 */

/**
 * @swagger
 * tags:
 *  name: Usuarios
 *  description: Seccion de usuarios
 * 
 * components: 
 *  schemas:
 *      address list:
 *          type: object
 *          properties:
 *              address:
 *                  type: string
 *              option:
 *                  type: integer
 *          example:
 *              address: Plaza Principal
 *              option: 1
 */

/**
 * @swagger
 * tags:
 *  name: Usuarios
 *  description: Seccion de usuarios
 * 
 * components: 
 *  schemas:
 *      logout:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *              usuario:
 *                  type: string
 *              administrador:
 *                  type: boolean
 *          example:
 *              nombre: Arnedes Olegario
 *              nombre de usuario: arneolegario
 *              administrador: false
 */

/**
 * @swagger
 * tags:
 *  name: Usuarios
 *  description: Seccion de usuarios
 * 
 * components: 
 *  schemas:
 *      login:
 *          type: object
 *          requred:
 *              -email
 *              -password
 *          properties:
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *          example:
 *              email: aolegario@nebular.com
 *              password: arneolegario
 */

/**
 * @swagger
 * tags:
 *  name: Usuarios
 *  description: Seccion de usuarios
 * 
 * components: 
 *  schemas:
 *      addAddress:
 *          type: object
 *          requred:
 *              -address
 *          properties:
 *              address:
 *                  type: string
 *          example:
 *              address: calle 26#35-12
 */

/**
 * @swagger
 * tags:
 *  name: Usuarios
 *  description: Seccion de usuarios
 * 
 * components: 
 *  schemas:
 *      registro:
 *          type: object
 *          requred:
 *              -nombre
 *              -usuario
 *              -contrasena
 *              -email
 *              -telefono
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: Nombres 
 *              usuario:
 *                  type: string
 *                  description: Nombre de usuario
 *              contrasena:
 *                  type: string
 *                  description: Contrasena
 *              email:
 *                  type: string
 *                  description: Correo electronico
 *              telefono:
 *                  type: integer
 *                  description: Telefono
 *          example:
 *              nombre: Arnedes Olegario
 *              usuario: arneolegario
 *              contrasena: Deivic007
 *              email: olegario.arnedes@nebular.com
 *              telefono: 3735648623
 */

/**
 * @swagger
 * tags:
 *  name: Productos
 *  description: Seccion de usuarios
 * 
 * components: 
 *  schemas:
 *      suspend user:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *          example:
 *              email: user@delilahresto.com
 */

module.exports = router;