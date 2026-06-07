import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const authClient = axios.create({
  baseURL: `${API_BASE}/auth`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function getErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || error?.message || fallbackMessage;
}

async function requestAuth(path, method, body) {
  try {
    const response = await authClient.request({
      url: path,
      method,
      data: body,
    });

    return response.data;
  } catch (error) {
    const message = error?.response?.status === 429
      ? 'Too many authentication attempts. Please wait a few minutes and try again.'
      : getErrorMessage(error, 'Authentication request failed');

    const authError = new Error(message);
    authError.status = error?.response?.status;
    authError.retryAfter = error?.response?.headers?.['retry-after'];
    throw authError;
  }
}

export function registerUser(data) {
  return requestAuth('/register', 'POST', data);
}

export function loginUser(data) {
  return requestAuth('/login', 'POST', data);
}

export function refreshSession() {
  return requestAuth('/refresh', 'POST');
}

export function logoutUser() {
  return requestAuth('/logout', 'POST');
}

export async function fetchCurrentUser() {
  try {
    const response = await authClient.get('/me');
    return response.data.user;
  } catch (error) {
    const message = error?.response?.status === 429
      ? 'Too many authentication attempts. Please wait a few minutes and try again.'
      : getErrorMessage(error, 'Session unavailable');

    const authError = new Error(message);
    authError.status = error?.response?.status;
    authError.retryAfter = error?.response?.headers?.['retry-after'];
    throw authError;
  }
}
