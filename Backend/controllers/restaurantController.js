const { SurplusFood, User } = require('../models');

exports.createSurplus = async (req, res) => {
  try {
    const { title, description, quantity, expiryTime, pickupDeadline } = req.body;

    if (!title || !quantity || !expiryTime || !pickupDeadline) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const surplus = await SurplusFood.create({
      restaurantId: req.user.id,
      title,
      description: description || '',
      quantity,
      expiryTime,
      pickupDeadline,
      status: 'pending',
    });

    // Auto-assign first verified collector
    const collector = await User.findOne({
      where: { role: 'collector', verified: true },
      order: [['createdAt', 'ASC']],
    });

    if (collector) {
      surplus.assignedCollectorId = collector.id;
      surplus.status = 'assigned';
      await surplus.save();
    }

    return res.status(201).json({
      message: 'Surplus created successfully',
      surplus,
      assignedCollector: collector
        ? { id: collector.id, name: collector.name, email: collector.email }
        : null,
    });
  } catch (error) {
    console.error('Create surplus error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getSurplusList = async (req, res) => {
  try {
    const surpluses = await SurplusFood.findAll({
      where: { restaurantId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(surpluses);
  } catch (error) {
    console.error('Get surplus list error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getImpactSummary = async (req, res) => {
  try {
    const surpluses = await SurplusFood.findAll({
      where: { restaurantId: req.user.id, status: 'delivered' },
    });

    const totalQuantity = surpluses.reduce((sum, s) => sum + s.quantity, 0);
    const meals = totalQuantity * 2;
    const co2Saved = totalQuantity * 2.5;

    return res.status(200).json({
      totalQuantity,
      meals,
      co2Saved,
      totalDeliveries: surpluses.length,
    });
  } catch (error) {
    console.error('Get impact summary error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

