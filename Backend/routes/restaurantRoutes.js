const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const restaurantApprovalMiddleware = require('../middleware/restaurantApprovalMiddleware');

const router = express.Router();

router.post(
  '/surplus',
  authMiddleware,
  roleMiddleware('restaurant'),
  restaurantApprovalMiddleware,
  restaurantController.createSurplus
);

router.get(
  '/surplus',
  authMiddleware,
  roleMiddleware('restaurant'),
  restaurantApprovalMiddleware,
  restaurantController.getSurplusList
);

router.put(
  '/surplus/:id',
  authMiddleware,
  roleMiddleware('restaurant'),
  restaurantApprovalMiddleware,
  restaurantController.updateSurplus
);

router.delete(
  '/surplus/:id',
  authMiddleware,
  roleMiddleware('restaurant'),
  restaurantApprovalMiddleware,
  restaurantController.deleteSurplus
);

router.get(
  '/impact',
  authMiddleware,
  roleMiddleware('restaurant'),
  restaurantApprovalMiddleware,
  restaurantController.getImpactSummary
);

router.get(
  '/pickup-history',
  authMiddleware,
  roleMiddleware('restaurant'),
  restaurantApprovalMiddleware,
  restaurantController.getPickupHistory
);

router.get(
  '/notifications',
  authMiddleware,
  roleMiddleware('restaurant'),
  restaurantApprovalMiddleware,
  restaurantController.getNotifications
);

router.get(
  '/profile',
  authMiddleware,
  roleMiddleware('restaurant'),
  restaurantController.getProfile
);

module.exports = router;

