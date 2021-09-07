const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info:{
            title: "Mi Primera API",
            version: "1.0.0",
            description: "Primer proyecto del bootcamp Backend de Acámica."
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: 'Local server'
            }
        ],
        components: {
            securitySchemes: {
                basicAuth: {
                    type: "http",
                    scheme: "basic"
                }
            }
        },
        security: [
            {
                basicAuth: []
            }
        ]
    },
    apis: ["./src/routes/*.js"]
};

module.exports = swaggerOptions;