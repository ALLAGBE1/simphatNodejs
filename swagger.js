const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'API SIMPHAT', 
      version: '1.0.0', 
      description: 'API du projet SIMPHAT', 
    },
  },
  apis: ['./routes/*.js', './swagger-definitions.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;