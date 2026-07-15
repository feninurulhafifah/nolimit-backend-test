const app = require('./app');
const { sequelize } = require('./models');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Sinkronisasi Database MySQL
sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('Database connected & synchronized.');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err.message);
  });