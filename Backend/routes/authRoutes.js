const express = require('express');
const path = require('path');
const multer = require('multer');
const authController = require('../controllers/authController');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../uploads/documents'));
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      cb(null, `${timestamp}_${safeName}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG and PDF files are allowed')); // will be handled by express error handler
    }
  },
});

router.post(
  '/register',
  upload.fields([
    { name: 'businessLicense', maxCount: 1 },
    { name: 'registrationDoc', maxCount: 1 },
  ]),
  authController.register
);
router.post('/login', authController.login);

module.exports = router;

