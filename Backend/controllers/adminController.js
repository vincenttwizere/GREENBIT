const { User, SurplusFood, Delivery } = require('../models');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.verified = true;
    await user.save();

    return res.status(200).json({ message: 'User verified', user });
  } catch (error) {
    console.error('Verify user error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllSurplus = async (req, res) => {
  try {
    const surpluses = await SurplusFood.findAll({
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(surpluses);
  } catch (error) {
    console.error('Get all surplus error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const deliveredSurplus = await SurplusFood.findAll({
      where: { status: 'delivered' },
    });

    const totalQuantity = deliveredSurplus.reduce((sum, s) => sum + s.quantity, 0);
    const meals = totalQuantity * 2;
    const co2Saved = totalQuantity * 2.5;
    const totalDeliveries = deliveredSurplus.length;

    const activeUsers = await User.count();

    return res.status(200).json({
      totalQuantity,
      meals,
      co2Saved,
      totalDeliveries,
      activeUsers,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

