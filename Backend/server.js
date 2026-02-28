const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, ensureDatabaseExists } = require('./models');
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const collectorRoutes = require('./routes/collectorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { seedInitialData } = require('./utils/seed');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Green Bit Foundation API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/collector', collectorRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    await sequelize.sync();
    await seedInitialData();

    app.listen(PORT, () => {
      console.log(`Green Bit backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

