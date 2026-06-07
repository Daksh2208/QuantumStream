const crypto = require('crypto');

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const HASH_ITERATIONS = 120000;
const HASH_LENGTH = 32;
const HASH_DIGEST = 'sha256';

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

module.exports = {
  createPasswordRecord,
  hashPassword,
  validatePassword,
  verifyPassword,
};
