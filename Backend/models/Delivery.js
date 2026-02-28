const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const SurplusFood = require('./SurplusFood');

const Delivery = sequelize.define(
  'Delivery',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    surplusId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'surplus_food',
        key: 'id',
      },
    },
    collectorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    pickupTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveryTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'picked_up', 'delivered'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    tableName: 'deliveries',
    timestamps: true,
  }
);

Delivery.belongsTo(SurplusFood, { as: 'surplus', foreignKey: 'surplusId' });
Delivery.belongsTo(User, { as: 'collector', foreignKey: 'collectorId' });

module.exports = Delivery;

