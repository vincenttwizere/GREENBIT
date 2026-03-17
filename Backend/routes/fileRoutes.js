const express = require('express');
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:filename', authMiddleware, fileController.serveFile);

module.exports = router;
