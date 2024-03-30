import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'What is pill main server',
      description: 'Searching pill information from image',
    },
    servers: [{ url: `http://localhost:3000` }],
  },
  apis: ['src/**/*.ts'],
};
const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
