import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Edu Admin API',
      version: '1.0.0',
      description: 'Документація для системи Edu Admin',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        url: 'https://edu-admin-api.azurewebsites.net',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Шлях до файлів з описом endpoint'ів
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
