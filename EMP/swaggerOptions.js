const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'Your API description'
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server'
      }
    ]
  },
  apis: ['./routes/userRoutes.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;