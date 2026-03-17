const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const { User } = require('../models');

exports.serveFile = async (req, res) => {
  try {
    const { filename } = req.params;

    // Ensure this file belongs to the current user or is being accessed by an admin
    const fileUrl = `/api/files/${filename}`;

    const owner = await User.findOne({
      where: {
        [Op.or]: [
          { businessLicenseUrl: fileUrl },
          { registrationDocUrl: fileUrl },
        ],
      },
    });

    if (!owner) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (req.user.role !== 'admin' && req.user.id !== owner.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const filePath = path.join(__dirname, '../uploads/documents', filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    return res.sendFile(filePath);
  } catch (error) {
    console.error('File serve error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
