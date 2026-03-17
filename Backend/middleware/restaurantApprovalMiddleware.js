module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role !== 'restaurant') {
    return next();
  }

  if (req.user.status !== 'approved') {
    return res.status(403).json({
      message: 'Your account is under review. You will gain access once approved.',
    });
  }

  return next();
};
