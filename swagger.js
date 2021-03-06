const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '1.0.0',
    title: 'FastFeet API',
    description: 'Documentation automatically generated by the <b>swagger-autogen</b> module.',
  },
  host: 'localhost:5555',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Order',
      description: 'Endpoints for orders',
    },
    {
      name: 'Recipient',
      description: 'Endpoints for recipients',
    },
    {
      name: 'Delivery',
      description: 'Endpoints for delivery',
    },
    {
      name: 'Delivery Issues',
      description: 'Endpoints delivery issues',
    },
    {
      name: 'Delivery Man',
      description: 'Endpoints delivery man',
    },
    {
      name: 'Session',
      description: 'Endpoints Session',
    },
  ],
  components: {
    schemas: {
    },
  },
  definitions: {
    DeliveryIssues: {
      order_id: 0,
      description: '',
    },
    DeliveryMan: {
      name: '',
      email: '',
    },
    Order: {
      product: '',
      start_date: '',
      end_date: '',
      canceled_at: '',
    },
    Recipient: {
      nome: '',
      rua: '',
      numero: 0,
      complemento: '',
      estado: '',
      cidade: '',
      cep: '',
    },
  },
};

const outputFile = 'swagger_output.json';
const endpointsFiles = ['src/routes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
