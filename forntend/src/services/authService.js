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
    throw new Error(getErrorMessage(error, 'Authentication request failed'));
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
    throw new Error(getErrorMessage(error, 'Session unavailable'));
  }
}
