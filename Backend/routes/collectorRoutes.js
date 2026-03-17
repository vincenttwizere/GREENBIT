const express = require('express');
const collectorController = require('../controllers/collectorController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get(
  '/available',
  authMiddleware,
  roleMiddleware('collector'),
  collectorController.getAvailablePickups
);

router.post(
  '/accept/:id',
  authMiddleware,
  roleMiddleware('collector'),
  collectorController.acceptSurplus
);

router.post(
  '/pickup/:id',
  authMiddleware,
  roleMiddleware('collector'),
  collectorController.confirmPickup
);

router.post(
  '/deliver/:id',
  authMiddleware,
  roleMiddleware('collector'),
  collectorController.confirmDelivery
);

router.get(
  '/history',
  authMiddleware,
  roleMiddleware('collector'),
  collectorController.getDeliveryHistory
);

router.get(
  '/impact',
  authMiddleware,
  roleMiddleware('collector'),
  collectorController.getImpactSummary
);

router.get(
  '/notifications',
  authMiddleware,
  roleMiddleware('collector'),
  collectorController.getNotifications
);

router.get(
  '/profile',
  authMiddleware,
  roleMiddleware('collector'),
  collectorController.getProfile
);

module.exports = router;

