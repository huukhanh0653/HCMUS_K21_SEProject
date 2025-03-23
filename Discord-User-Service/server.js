require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('./src/routes/userRoutes');
const friendshipRoutes = require('./src/routes/friendshipRoutes');

const app = express();
app.use(express.json());

const mongoConnectionString = process.env.MONGO_STRING_CONNECTION; // Access the connection string from .env

if (!mongoConnectionString) {
  console.error('MONGO_STRING_CONNECTION is not defined in the .env file.');
  process.exit(1); // Exit if the connection string is missing
}

mongoose.connect(mongoConnectionString, {

}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User and Friendship API',
      version: '1.0.0',
      description: 'API for managing users and friendships',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/users', userRoutes);
app.use('/friendships', friendshipRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));