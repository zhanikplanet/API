const express = require('express');
const http = require('http');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerOptions = require('./swagger-config');
const { connectMongoDB } = require('./mongodb'); // Import the connectMongoDB function
const sampleRoutes = require('./route/sample');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve Swagger UI at /api-docs endpoint
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use routes
app.use('/api', sampleRoutes);

const PORT = process.env.PORT || 3000;

// Connect to MongoDB before starting the server
connectMongoDB()
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit the application if MongoDB connection fails
  });
