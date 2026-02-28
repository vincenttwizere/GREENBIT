const { Op } = require('sequelize');
const { SurplusFood, Delivery } = require('../models');

exports.getAvailablePickups = async (req, res) => {
  try {
    const collectorId = req.user.id;

    const surpluses = await SurplusFood.findAll({
      where: {
        [Op.or]: [
          { status: 'pending' },
          { status: 'assigned', assignedCollectorId: collectorId },
        ],
      },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(surpluses);
  } catch (error) {
    console.error('Get available pickups error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.acceptSurplus = async (req, res) => {
  try {
    const collectorId = req.user.id;
    const { id } = req.params;

    const surplus = await SurplusFood.findByPk(id);
    if (!surplus) {
      return res.status(404).json({ message: 'Surplus not found' });
    }

    if (surplus.status !== 'pending' && surplus.assignedCollectorId !== collectorId) {
      return res
        .status(400)
        .json({ message: 'Surplus cannot be accepted in its current state' });
    }

    surplus.assignedCollectorId = collectorId;
    surplus.status = 'assigned';
    await surplus.save();

    return res.status(200).json({ message: 'Surplus accepted', surplus });
  } catch (error) {
    console.error('Accept surplus error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.confirmPickup = async (req, res) => {
  try {
    const collectorId = req.user.id;
    const { id } = req.params;

    const surplus = await SurplusFood.findByPk(id);
    if (!surplus) {
      return res.status(404).json({ message: 'Surplus not found' });
    }

    if (surplus.assignedCollectorId !== collectorId) {
      return res.status(403).json({ message: 'You are not assigned to this surplus' });
    }

    if (surplus.status !== 'assigned') {
      return res.status(400).json({ message: 'Surplus is not in assigned state' });
    }

    surplus.status = 'picked_up';
    await surplus.save();

    const delivery = await Delivery.create({
      surplusId: surplus.id,
      collectorId,
      pickupTime: new Date(),
      status: 'picked_up',
    });

    return res.status(200).json({ message: 'Pickup confirmed', surplus, delivery });
  } catch (error) {
    console.error('Confirm pickup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.confirmDelivery = async (req, res) => {
  try {
    const collectorId = req.user.id;
    const { id } = req.params;

    const surplus = await SurplusFood.findByPk(id);
    if (!surplus) {
      return res.status(404).json({ message: 'Surplus not found' });
    }

    if (surplus.assignedCollectorId !== collectorId) {
      return res.status(403).json({ message: 'You are not assigned to this surplus' });
    }

    if (surplus.status !== 'picked_up') {
      return res.status(400).json({ message: 'Surplus must be picked up before delivery' });
    }

    surplus.status = 'delivered';
    await surplus.save();

    const delivery = await Delivery.findOne({
      where: { surplusId: surplus.id, collectorId },
      order: [['createdAt', 'DESC']],
    });

    if (delivery) {
      delivery.status = 'delivered';
      delivery.deliveryTime = new Date();
      await delivery.save();
    }

    const meals = surplus.quantity * 2;
    const co2Saved = surplus.quantity * 2.5;

    return res.status(200).json({
      message: 'Delivery confirmed',
      surplus,
      delivery,
      impact: {
        meals,
        co2Saved,
      },
    });
  } catch (error) {
    console.error('Confirm delivery error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getDeliveryHistory = async (req, res) => {
  try {
    const collectorId = req.user.id;

    const deliveries = await Delivery.findAll({
      where: { collectorId },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(deliveries);
  } catch (error) {
    console.error('Get delivery history error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

