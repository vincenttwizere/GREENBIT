const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get(
  '/users',
  authMiddleware,
  roleMiddleware('admin'),
  adminController.getUsers
);

router.put(
  '/verify/:id',
  authMiddleware,
  roleMiddleware('admin'),
  adminController.verifyUser
);

router.put(
  '/users/:id/status',
  authMiddleware,
  roleMiddleware('admin'),
  adminController.updateUserStatus
);

router.get(
  '/surplus',
  authMiddleware,
  roleMiddleware('admin'),
  adminController.getAllSurplus
);

router.get(
  '/analytics',
  authMiddleware,
  roleMiddleware('admin'),
  adminController.getAnalytics
);

router.get(
  '/notifications',
  authMiddleware,
  roleMiddleware('admin'),
  adminController.getNotifications
);

module.exports = router;

