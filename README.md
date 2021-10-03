# My Persistent APP

## ¿What is **_My Persistent APP_**?

It is an API that simulates the backend for Delilah Restaurant. On it users can sign up and make orders of the products offered by the restaurant.

### Prerequisites:

You need to have installed on your system:

- MongoDB (version 5.0 or greater)
- NodeJS (version 14.17 or greater)
- Redis server (version 3.2 or greater)
- Git (version 2.31)

## Setup 🔧

### 1. Clone the proyect: 

```bash
git clone https://github.com/castellarmartinez/My-Persistent-APP.git
```

### 2. Install dependencies: 

```bash
npm install
```

### 3. Set your enviroment variables:

You need tro create a file .env inside proyect's folder, with this variables:

-MONGODB_HOST: Host where MongoDB is running.
-MONGODB_PORT: Port MongodDB is using.
-REDIS_HOST: Host where Redis Server is running.
-REDIS_PORT: Port Redis Server is using.
-DB_NAME: Name for the database where the app will store the data.
-SECRET_PASS: Pass for hashing the users passwords via JWT.
-APP_PORT: Port the app will be using

An example could be:

```bash
MONGODB_HOST = 127.0.0.1
REDIS_HOST = 127.0.0.1
APP_PORT = 3000
MONGODB_PORT = 27017
REDIS_PORT = 6379
DB_NAME = ExampleDatabase
SECRET_PASS = ExamplePass
```

## Running the app 🚀

### 0. Start MongoDB (if not installed as a service):

```bash
mongod
```

### 1. Start the server: 

```bash
npm run start
```

### 2. Access Swagger documentation: 

Access Swagger documentation from this [link](http://localhost:3000/api-docs/).

## Running the test ✔️

The app implement a test for the creation of new users.

```bash
npm run test
```

## Routes anabled in the API 📦

### Public Routes

There are actions you could perform without being an registered user.

#### 1. Register:

For registration of new users without admin privileges. Example: :

```javascript
{
  "name": "Arnedes Olegario",
  "username": "arneolegario",
  "password": "Olegax007",
  "email": "olegario@delilahresto.com",
  "phone": 3735648623
}
```

#### 2. See products:

For seeing the list of products offered by the restaurant.

### Routes for registered users without admin privileges (it is required to use the token assigned to authenticate via Bearer Token)

This routes can be accessed only for users registered.

#### 1. Login:

Users can log in on the app, they need to use their email and password (for this route it is not required to use the token authentication).

#### 2. Add address to the address book:

Users can address to their address book. Example:

```javascript
{
  "address": "calle 26#35-12"
}
```

#### 3. See address book:

For getting the address book.

#### 4. See payment methods:

For getting the payments methods available.

#### 5. Order:

In this route users can order products offered by the restaurant. Example:

_path_: ProductID

_body_:

```javascript
{
  "quantity": 5,
  "payment": 2,
  "address": 1,
  "state": "open"
}
```

Where "payment" and "address" are the numbers of the payment method and address selected, respectively. It is advisable to see payment methods and address book before order.

Only "open" and "closed" are states valid in a new order.

#### 6. See orders history:

Users can access their orders history.

#### 7. Add product to an open order:

To add a new product (or increase the amount). Example:

_path_: ProductID
_query_: Quantity

#### 8. Remove product from an open order:

To remove a product (or decrease the amount). Example:

_path_: ProductID
_query_: Quantity

#### 9. Update payment method:

To update the payment method in an open order. Example:

_path_: Payment method's option.

#### 10. Update address:

To update the address in an open order. Example:

_query_: Address' option.

#### 11. Update order's state:

To update the state in an open order, only "confirmed" or "closed" are allowed.

### Routes for admin user:

To access these routes admin must be logged in and authenticated. For this app there is only one admin user (it is created when the database is initialized):

```javascript
email: "admin@delilahresto.com";
password: "@)T0(Z]p";
```

#### 1. See all users registered:

Allow to see all users registered.

#### 2. Suspend/unsuspend an user:

Allow suspension to users.

#### 3. Add new product:

This route allows to add new products to the restaurant. Example:

_path_: ProductId (ID that will identificate the product)

```javascript
{
  "name": "Changua",
  "price": 3000
}
```

#### 4. Update a product:

This route allows to update a product (name and price). Example:

Similary to the previous route.

#### 5. Delete a product:

Allows to delete a product from the restaurant. Example:

_path_: ProductID

#### 6. Add a new payment method:

This route allows adding a new payment method.

```javascript
{
  "method": "Paypal"
}
```

#### 7. Update payment method:

This route allows to update a payment method. Example:

_path_: Payment method's option

_body_:

```javascript
{
  "method": "Credit card"
}
```

#### 8. Delete a payment method:

This route allows to delete a payment method. Example:

_path_: Payment method's option

#### 9. See orders list:

Allows to see all orders.

#### 10. Update order's state:

Allow to update orders as an admin. Only "preparing", "shipping", "cancelled" or "delivered" are allowed.

## Build with 🛠️

- [Node.js](https://nodejs.org/es/docs/) - Programming Enviroment for JavaScript
- [Express](https://maven.apache.org/) - Framework for APIs
- [Mocha](https://mochajs.org/) - Framework for testing
- [MongoDB](https://www.mongodb.com/es) - Database non-relational
- [Redis](https://redis.io/) - In-memory data structure store
- [Swagger](https://swagger.io/docs/) - Documentation

## Authors ✒️

**David Castellar Martínez** [[GitHub](https://github.com/castellarmartinez/)]
[[LinkedIn](https://www.linkedin.com/in/castellarmartinez/)]
