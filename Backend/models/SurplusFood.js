const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const SurplusFood = sequelize.define(
  'SurplusFood',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    restaurantId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.FLOAT.UNSIGNED,
      allowNull: false,
    },
    expiryTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    pickupDeadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'assigned', 'picked_up', 'delivered'),
      allowNull: false,
      defaultValue: 'pending',
    },
    assignedCollectorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    tableName: 'surplus_food',
    timestamps: true,
  }
);

SurplusFood.belongsTo(User, { as: 'restaurant', foreignKey: 'restaurantId' });
SurplusFood.belongsTo(User, { as: 'assignedCollector', foreignKey: 'assignedCollectorId' });

module.exports = SurplusFood;

