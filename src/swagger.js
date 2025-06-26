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
    paths: {
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and get JWT',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                  },
                  required: ['email', 'password'],
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successful login',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users (admin only)',
          responses: {
            200: {
              description: 'List of users',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { type: 'object' } },
                },
              },
            },
          },
        },
      },
      '/users/create': {
        post: {
          tags: ['Users'],
          summary: 'Create new user (admin only)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateUser' },
              },
            },
          },
          responses: { 201: { description: 'User created' } },
        },
      },
      '/groups': {
        get: {
          tags: ['Groups'],
          summary: 'Get all groups',
          responses: { 200: { description: 'List of groups' } },
        },
        post: {
          tags: ['Groups'],
          summary: 'Create a group',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateGroup' },
              },
            },
          },
          responses: { 201: { description: 'Group created' } },
        },
      },
    },
    components: {
      schemas: {
        CreateUser: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'TEACHER', 'STUDENT'] },
          },
          required: ['email', 'password', 'role'],
        },
        CreateGroup: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            studentIds: {
              type: 'array',
              items: { type: 'integer' },
            },
          },
          required: ['name'],
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
