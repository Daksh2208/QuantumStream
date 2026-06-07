const rateLimit = require('express-rate-limit');

const { getAuthenticatedUser } = require('../services/authService');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const ALLOWED_ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

function rejectBadOrigin(req, res, next) {
  const origin = req.get('origin');

  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    res.status(403).json({ message: 'Origin not allowed' });
    return;
  }

  next();
}

async function requireAuth(req, res, next) {
  try {
    const user = await getAuthenticatedUser(req, res);

    if (!user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    req.authUser = user;
    next();
  } catch (error) {
    res.status(error.statusCode || 401).json({ message: error.message || 'Authentication required' });
  }
}

module.exports = {
  authLimiter,
  rejectBadOrigin,
  requireAuth,
};
