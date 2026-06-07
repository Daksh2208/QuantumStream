const User = require('../models/User');
const { createPasswordRecord, validatePassword, verifyPassword } = require('./passwordService');
const {
  buildUserResponse,
  clearAuthCookies,
  hashToken,
  setAuthCookies,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require('./tokenService');

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ');
}

function serviceError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function issueSession(user, res) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  user.refreshTokenHash = hashToken(refreshToken);
  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  user.tokenVersion = user.tokenVersion || 0;
  user.lastLoginAt = new Date();
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);
  return buildUserResponse(user);
}

async function rotateSessionFromRefresh(req, res) {
  const refreshToken = req.cookies?.qs_refresh;

  if (!refreshToken) {
    return null;
  }

  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    return null;
  }

  const user = await User.findById(payload.sub);
  if (!user || user.tokenVersion !== payload.tokenVersion || user.refreshTokenHash !== hashToken(refreshToken)) {
    return null;
  }

  await issueSession(user, res);
  return user;
}

async function getAuthenticatedUser(req, res) {
  const accessToken = req.cookies?.qs_access;

  if (accessToken) {
    try {
      const payload = verifyAccessToken(accessToken);
      const user = await User.findById(payload.sub);

      if (user && user.tokenVersion === payload.tokenVersion) {
        return user;
      }
    } catch (error) {
      // fall through to refresh token handling
    }
  }

  return rotateSessionFromRefresh(req, res);
}

async function registerUser({ name, email, password }, res) {
  const normalizedName = normalizeName(name);
  const normalizedEmail = normalizeEmail(email);
  const submittedPassword = String(password || '');

  if (normalizedName.length < 2) {
    throw serviceError(400, 'Name must be at least 2 characters long');
  }

  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    throw serviceError(400, 'A valid email address is required');
  }

  if (!validatePassword(submittedPassword)) {
    throw serviceError(400, 'Password must be at least 8 characters and include a letter, a number, and a special character');
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw serviceError(409, 'An account with that email already exists');
  }

  const { salt, hash } = createPasswordRecord(submittedPassword);
  const user = await User.create({
    name: normalizedName,
    email: normalizedEmail,
    passwordSalt: salt,
    passwordHash: hash,
  });

  await issueSession(user, res);
  return buildUserResponse(user);
}

async function loginUser({ email, password }, res) {
  const normalizedEmail = normalizeEmail(email);
  const submittedPassword = String(password || '');

  if (!normalizedEmail || !submittedPassword) {
    throw serviceError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw serviceError(401, 'Invalid email or password');
  }

  if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
    throw serviceError(423, 'Account temporarily locked. Try again later.');
  }

  const passwordMatches = verifyPassword(submittedPassword, user.passwordSalt, user.passwordHash);
  if (!passwordMatches) {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_WINDOW_MS);
      user.failedLoginAttempts = 0;
    }

    await user.save();
    throw serviceError(401, 'Invalid email or password');
  }

  await issueSession(user, res);
  return buildUserResponse(user);
}

async function refreshSession(req, res) {
  const user = await rotateSessionFromRefresh(req, res);
  if (!user) {
    throw serviceError(401, 'Session expired');
  }

  return buildUserResponse(user);
}

async function logoutUser(user, res) {
  user.tokenVersion += 1;
  user.refreshTokenHash = null;
  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  await user.save();
  clearAuthCookies(res);
}

module.exports = {
  getAuthenticatedUser,
  loginUser,
  logoutUser,
  registerUser,
  refreshSession,
  serviceError,
};
