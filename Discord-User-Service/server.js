require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('./src/routes/userRoutes');
const friendshipRoutes = require('./src/routes/friendshipRoutes');

const app = express();
app.use(express.json());

// ✅ Allow all origins with CORS
app.use(cors({ 
  origin: '*', 
  methods: 'GET, POST, PUT, DELETE', 
  allowedHeaders: 'Content-Type, Authorization' 
}));

// ✅ Manually set CORS headers in responses (optional)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const mongoConnectionString = process.env.MONGO_STRING_CONNECTION;

if (!mongoConnectionString) {
  console.error('MONGO_STRING_CONNECTION is not defined in the .env file.');
  process.exit(1);
}

mongoose.connect(mongoConnectionString, {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User and Friendship API',
      version: '1.0.0',
      description: 'API for managing users and friendships',
    },
    servers: [{ url: 'http://localhost:8087' }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/users', userRoutes);
app.use('/api/friendships', friendshipRoutes);

const PORT = 8087;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
