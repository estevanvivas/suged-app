import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SUGED API',
      version: '1.0.0',
      description: 'API para gestion de reservas de espacios deportivos'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      },
      {
        url: 'https://api.suged.com',
        description: 'Servidor producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token (incluye "Bearer " antes del token)'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            error: { type: 'string' },
            details: { type: 'object', additionalProperties: true }
          },
          example: {
            code: 'VALIDATION_ERROR',
            error: 'Error de validación',
            details: {
              field: ['Mensaje de validación']
            }
          }
        }
      }
    }
  },
  apis: [
    './src/modules/**/interfaces/http/*.routes.ts',
    './src/app.ts'
  ]
};

export const swaggerSpec = swaggerJSDoc(options);
