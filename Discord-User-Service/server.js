const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./src/routes/userRoutes');
const friendshipRoutes = require('./src/routes/friendshipRoutes');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://ltgiang21:hySGOZ65nKuLhboI@cluster0.xe3sy.mongodb.net/?retryWrites=true&w=majority&appName=cluster0', {

}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/users', userRoutes);
app.use('/friendships', friendshipRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));