export const checkUserRole = (requireRole) => (req, res, next) => {
  if (!req.user || req.user.role !== requireRole) {
    return res.status(403).json({ message: 'Access denied: insufficient permissions' });
  }
  next();
};

export const checkBandStatus = (requiredStatus) => (req, res, next) => {
  if (!req.user || req.user.role !== 'band') {
    return res.status(403).json({ message: 'Access denied: Only bands can perform this action' });
  }
  if (req.user.status !== requiredStatus) {
    return res.status(403).json({ message: `Access denied: Your band status must be '${requiredStatus}'` });
  }
  next();
};
