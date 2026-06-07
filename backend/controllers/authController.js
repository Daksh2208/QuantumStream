const { loginUser, logoutUser, refreshSession, registerUser } = require('../services/authService');
const { buildUserResponse } = require('../services/tokenService');

function sendError(res, error, fallbackMessage) {
  res.status(error.statusCode || 500).json({
    message: error.message || fallbackMessage,
  });
}

async function register(req, res) {
  try {
    const user = await registerUser(req.body, res);
    res.status(201).json({
      message: 'Account created',
      user,
    });
  } catch (error) {
    sendError(res, error, 'Unable to create account');
  }
}

async function login(req, res) {
  try {
    const user = await loginUser(req.body, res);
    res.json({
      message: 'Logged in',
      user,
    });
  } catch (error) {
    sendError(res, error, 'Unable to sign in');
  }
}

async function refresh(req, res) {
  try {
    const user = await refreshSession(req, res);
    res.json({
      message: 'Session refreshed',
      user,
    });
  } catch (error) {
    sendError(res, error, 'Session expired');
  }
}

async function me(req, res) {
  res.json({ user: buildUserResponse(req.authUser) });
}

async function logout(req, res) {
  try {
    await logoutUser(req.authUser, res);
    res.json({ message: 'Logged out' });
  } catch (error) {
    sendError(res, error, 'Unable to sign out');
  }
}

module.exports = {
  login,
  logout,
  me,
  refresh,
  register,
};
