const { Op } = require('sequelize');
const { SurplusFood, Delivery, User } = require('../models');

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
      include: [
        {
          model: SurplusFood,
          as: 'surplus',
          include: [
            {
              model: User,
              as: 'restaurant',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const history = deliveries.map((d) => ({
      id: d.id,
      pickupTime: d.pickupTime,
      deliveryTime: d.deliveryTime,
      status: d.status,
      foodItem: d.surplus?.title || 'Food item',
      quantity: d.surplus?.quantity || 0,
      restaurantId: d.surplus?.restaurantId,
      restaurantName: d.surplus?.restaurant?.name,
    }));

    return res.status(200).json(history);
  } catch (error) {
    console.error('Get delivery history error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getImpactSummary = async (req, res) => {
  try {
    const collectorId = req.user.id;

    const deliveries = await Delivery.findAll({
      where: { collectorId, status: 'delivered' },
      include: [
        {
          model: SurplusFood,
          as: 'surplus',
        },
      ],
    });

    const totalQuantity = deliveries.reduce((sum, d) => sum + (d.surplus?.quantity || 0), 0);
    const meals = totalQuantity * 2;
    const co2Saved = totalQuantity * 2.5;

    return res.status(200).json({
      totalQuantity,
      meals,
      co2Saved,
      totalDeliveries: deliveries.length,
    });
  } catch (error) {
    console.error('Get impact summary error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    // Placeholder: notifications can be derived from actions/logs in a real system.
    return res.status(200).json([]);
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
      location: user.location,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return res.status(200).json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

