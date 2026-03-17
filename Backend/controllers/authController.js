const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// ensure we have a JWT secret; fall back to a hard‑coded value for development
const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_IN_PRODUCTION';
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not defined in .env, using fallback secret. Change this for production.');
}

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      location,
      address,
      contactNumber,
      foodType,
      operatingHours,
    } = req.body;

    // Handle uploaded document fields (if any): businessLicense + registrationDoc
    const files = req.files || {};
    const businessLicense = files.businessLicense?.[0];
    const registrationDoc = files.registrationDoc?.[0];

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Enforce additional hotel/restaurant-required fields and documents
    const userRole = role || 'restaurant';
    const needsApproval = userRole === 'restaurant';
    if (needsApproval) {
      if (!location || !address || !contactNumber || !foodType || !operatingHours) {
        return res.status(400).json({
          message:
            'Location, address, contact number, food type, and operating hours are required for restaurant accounts',
        });
      }
      if (!businessLicense || !registrationDoc) {
        return res.status(400).json({
          message: 'Business license and company registration documents are required for restaurant accounts',
        });
      }
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      location: location || null,
      address: address || null,
      contactNumber: contactNumber || null,
      foodType: foodType || null,
      operatingHours: operatingHours || null,
      businessLicenseUrl: businessLicense ? `/api/files/${businessLicense.filename}` : null,
      registrationDocUrl: registrationDoc ? `/api/files/${registrationDoc.filename}` : null,
      status: needsApproval ? 'pending' : 'approved',
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        status: user.status,
        location: user.location,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        status: user.status,
        location: user.location,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

