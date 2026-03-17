const { SurplusFood, User, Delivery } = require('../models');

exports.createSurplus = async (req, res) => {
  try {
    const {
      title,
      foodCategory,
      description,
      quantity,
      quantityUnit,
      storageType,
      specialInstructions,
      photoUrl,
      expiryTime,
      pickupWindowStart,
      pickupDeadline,
    } = req.body;

    if (!title || !quantity || !expiryTime || !pickupDeadline) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const surplus = await SurplusFood.create({
      restaurantId: req.user.id,
      title,
      foodCategory: foodCategory || null,
      description: description || '',
      quantity,
      quantityUnit: quantityUnit || 'kg',
      storageType: storageType || 'Room Temp',
      specialInstructions: specialInstructions || '',
      photoUrl: photoUrl || null,
      expiryTime,
      pickupWindowStart: pickupWindowStart || null,
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

exports.updateSurplus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      foodCategory,
      description,
      quantity,
      quantityUnit,
      storageType,
      specialInstructions,
      photoUrl,
      expiryTime,
      pickupWindowStart,
      pickupDeadline,
    } = req.body;

    const surplus = await SurplusFood.findByPk(id);
    if (!surplus) {
      return res.status(404).json({ message: 'Surplus not found' });
    }

    if (surplus.restaurantId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (surplus.status === 'delivered') {
      return res.status(400).json({ message: 'Delivered surplus cannot be edited' });
    }

    await surplus.update({
      title: title ?? surplus.title,
      foodCategory: foodCategory ?? surplus.foodCategory,
      description: description ?? surplus.description,
      quantity: quantity ?? surplus.quantity,
      quantityUnit: quantityUnit ?? surplus.quantityUnit,
      storageType: storageType ?? surplus.storageType,
      specialInstructions: specialInstructions ?? surplus.specialInstructions,
      photoUrl: photoUrl ?? surplus.photoUrl,
      expiryTime: expiryTime ?? surplus.expiryTime,
      pickupWindowStart: pickupWindowStart ?? surplus.pickupWindowStart,
      pickupDeadline: pickupDeadline ?? surplus.pickupDeadline,
    });

    return res.status(200).json({ message: 'Surplus updated', surplus });
  } catch (error) {
    console.error('Update surplus error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteSurplus = async (req, res) => {
  try {
    const { id } = req.params;

    const surplus = await SurplusFood.findByPk(id);
    if (!surplus) {
      return res.status(404).json({ message: 'Surplus not found' });
    }

    if (surplus.restaurantId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (surplus.status === 'delivered') {
      return res.status(400).json({ message: 'Delivered surplus cannot be deleted' });
    }

    await surplus.destroy();

    return res.status(200).json({ message: 'Surplus deleted' });
  } catch (error) {
    console.error('Delete surplus error:', error);
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

exports.getPickupHistory = async (req, res) => {
  try {
    const deliveries = await Delivery.findAll({
      include: [
        {
          model: SurplusFood,
          as: 'surplus',
          where: { restaurantId: req.user.id },
          include: [
            {
              model: User,
              as: 'assignedCollector',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const history = deliveries.map((d) => ({
      id: d.id,
      date: d.deliveryTime || d.pickupTime || d.createdAt,
      foodItem: d.surplus?.title || 'Food item',
      quantity: d.surplus?.quantity || 0,
      collector: d.surplus?.assignedCollector?.name || 'N/A',
      confirmationStatus: d.status,
    }));

    return res.status(200).json(history);
  } catch (error) {
    console.error('Get pickup history error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    // Placeholder: notifications can be derived from actions/logs in a real system.
    // For now, return an empty array to keep the UI stable.
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
      status: user.status,
      location: user.location,
      address: user.address,
      contactNumber: user.contactNumber,
      foodType: user.foodType,
      operatingHours: user.operatingHours,
      businessLicenseUrl: user.businessLicenseUrl,
      registrationDocUrl: user.registrationDocUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return res.status(200).json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

