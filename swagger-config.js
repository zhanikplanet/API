module.exports = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'My API',
        version: '1.0.0',
        description: 'A sample API for learning Swagger',
      },
      servers: [
        {
          url: 'http://localhost:3000/',
        },
      ],
    },
    apis: ['./routes/*.js'], 
  };
  