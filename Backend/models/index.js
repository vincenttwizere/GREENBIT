const { sequelize, ensureDatabaseExists } = require('../config/database');
const User = require('./User');
const SurplusFood = require('./SurplusFood');
const Delivery = require('./Delivery');

// Additional associations if needed in queries
User.hasMany(SurplusFood, { as: 'surpluses', foreignKey: 'restaurantId' });
User.hasMany(Delivery, { as: 'deliveries', foreignKey: 'collectorId' });
SurplusFood.hasMany(Delivery, { as: 'deliveries', foreignKey: 'surplusId' });

module.exports = {
  sequelize,
  ensureDatabaseExists,
  User,
  SurplusFood,
  Delivery,
};

