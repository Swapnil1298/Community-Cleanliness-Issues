import { request, setToken } from './apiClient';

export const register = async (email, password, displayName, profileImage) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  formData.append('displayName', displayName);
  formData.append('profileImage', profileImage);

  const API_BASE = import.meta.env.VITE_API_URL || '/api';

  let response;
  try {
    response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: formData,
    });
  } catch {
    throw new Error(
      'Cannot connect to the server. Start the backend with: cd server && npm run dev'
    );
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Registration failed');
  }

  const data = await response.json();
  setToken(data.token);
  return data.user;
};

export const login = async (email, password) => {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.user;
};

export const googleLogin = async (credential) => {
  const data = await request('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  });
  setToken(data.token);
  return data.user;
};

export const getCurrentUser = async () => {
  const data = await request('/auth/me');
  return data.user;
};

export const updateProfile = async (profileData) => {
  const data = await request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
  return data.user;
};

export const forgotPassword = async (email) => {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const logout = () => {
  setToken(null);
};
