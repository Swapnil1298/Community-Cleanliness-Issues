import { googleLogout } from '@react-oauth/google';
import { request, setToken } from './apiClient';

export const register = async (email, password, displayName) => {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, displayName }),
  });
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
  googleLogout();
  setToken(null);
};
