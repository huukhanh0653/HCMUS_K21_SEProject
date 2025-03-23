const express = require('express');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require('./src/routes/userRoutes');
const friendshipRoutes = require('./src/routes/friendshipRoutes');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://ltgiang21:hySGOZ65nKuLhboI@cluster0.xe3sy.mongodb.net/?retryWrites=true&w=majority&appName=cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

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
