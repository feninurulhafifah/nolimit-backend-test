const express = require('express');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

app.use(express.json());

// Routes mapping
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Handling 404 Route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

module.exports = app;