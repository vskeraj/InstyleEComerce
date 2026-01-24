import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'InstyleEComerce API',
      version: '1.0.0',
      description: 'E-commerce microservices API documentation',
      contact: {
        name: 'API Support',
        email: 'support@instyle.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8003',
        description: 'Auth Service'
      },
      {
        url: 'http://localhost:8001',
        description: 'Orders Service'
      },
      {
        url: 'http://localhost:8002',
        description: 'Product Service'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/index.ts']
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };
