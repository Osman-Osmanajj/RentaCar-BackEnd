import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rent a Car API',
      version: '1.0.0',
      description: 'Dokumentim i API-së për Rent-a-Car',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
    components: {
      securitySchemes: {
        // JWT (Bearer token) - opsionale nëse ke login me token
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        // X-Tenant-ID header
        TenantHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'X-Tenant-ID',
          description: 'ID e tenant-it për kërkesat tenant scoped (kërkohet për shumicën e API-ve tenant scoped)'
        }
      }
    }
   
  },
  apis: ['./routes/*.js'], // ndrysho path-in nëse routes janë diku tjetër
};

export const swaggerSpec = swaggerJSDoc(options);
