const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post(
  '/surplus',
  authMiddleware,
  roleMiddleware('restaurant'),
  restaurantController.createSurplus
);

router.get(
  '/surplus',
  authMiddleware,
  roleMiddleware('restaurant'),
  restaurantController.getSurplusList
);

router.get(
  '/impact',
  authMiddleware,
  roleMiddleware('restaurant'),
  restaurantController.getImpactSummary
);

module.exports = router;

