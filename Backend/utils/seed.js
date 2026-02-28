const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function seedInitialData() {
  const adminEmail = 'admin@greenbit.org';
  const restaurantEmail = 'restaurant@greenbit.org';
  const collectorEmail = 'collector@greenbit.org';

  const existingAdmin = await User.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const password = await bcrypt.hash('AdminPass123!', 10);
    await User.create({
      name: 'Platform Admin',
      email: adminEmail,
      password,
      role: 'admin',
      verified: true,
      location: 'HQ',
    });
  }

  const existingRestaurant = await User.findOne({ where: { email: restaurantEmail } });
  if (!existingRestaurant) {
    const password = await bcrypt.hash('Restaurant123!', 10);
    await User.create({
      name: 'Sunrise Hotel',
      email: restaurantEmail,
      password,
      role: 'restaurant',
      verified: true,
      location: 'Downtown',
    });
  }

  const existingCollector = await User.findOne({ where: { email: collectorEmail } });
  if (!existingCollector) {
    const password = await bcrypt.hash('Collector123!', 10);
    await User.create({
      name: 'Green Wheels',
      email: collectorEmail,
      password,
      role: 'collector',
      verified: true,
      location: 'Citywide',
    });
  }
}

module.exports = {
  seedInitialData,
};

