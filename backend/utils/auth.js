const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const ACCESS_COOKIE = 'qs_access';
const REFRESH_COOKIE = 'qs_refresh';
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const HASH_ITERATIONS = 120000;
const HASH_LENGTH = 32;
const HASH_DIGEST = 'sha256';

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function getJwtSecret(name) {
  const explicit = process.env[name];

  if (explicit) {
    return explicit;
  }

  if (isProduction()) {
    throw new Error(`${name} is required in production`);
  }

  return crypto.createHash('sha256').update(name).digest('hex');
}

function validatePassword(password) {
  return PASSWORD_REGEX.test(password);
}

function createPasswordRecord(password) {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_LENGTH, HASH_DIGEST).toString('hex');

  return { salt, hash };
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_LENGTH, HASH_DIGEST).toString('hex');
}

function verifyPassword(password, salt, expectedHash) {
  const computedHash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      tokenVersion: user.tokenVersion,
    },
    getJwtSecret('JWT_ACCESS_SECRET'),
    {
      algorithm: 'HS256',
      expiresIn: '15m',
      issuer: 'QuantumStream',
      audience: 'QuantumStream-web',
    }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      tokenVersion: user.tokenVersion,
    },
    getJwtSecret('JWT_REFRESH_SECRET'),
    {
      algorithm: 'HS256',
      expiresIn: '7d',
      issuer: 'QuantumStream',
      audience: 'QuantumStream-web',
    }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret('JWT_ACCESS_SECRET'), {
    algorithms: ['HS256'],
    issuer: 'QuantumStream',
    audience: 'QuantumStream-web',
  });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, getJwtSecret('JWT_REFRESH_SECRET'), {
    algorithms: ['HS256'],
    issuer: 'QuantumStream',
    audience: 'QuantumStream-web',
  });
}

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? 'strict' : 'lax',
  };
}

function getAccessCookieOptions() {
  return {
    ...getCookieOptions(),
    path: '/',
    maxAge: 15 * 60 * 1000,
  };
}

function getRefreshCookieOptions() {
  return {
    ...getCookieOptions(),
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function buildUserResponse(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    lastLoginAt: user.lastLoginAt,
  };
}

module.exports = {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  buildUserResponse,
  createPasswordRecord,
  getAccessCookieOptions,
  getRefreshCookieOptions,
  hashToken,
  validatePassword,
  verifyAccessToken,
  verifyPassword,
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
};
