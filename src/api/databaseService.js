import { request } from './apiClient';

// Upload issue image
export const uploadIssueImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const API_BASE = import.meta.env.VITE_API_URL || '/api';
  return fetch(`${API_BASE}/upload/issue`, {
    method: 'POST',
    body: formData,
  }).then(res => {
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  });
};

// Upload profile image
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('profileImage', file);
  
  const API_BASE = import.meta.env.VITE_API_URL || '/api';
  return fetch(`${API_BASE}/upload/profile`, {
    method: 'POST',
    body: formData,
  }).then(res => {
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  });
};

export const uploadResolutionFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const API_BASE = import.meta.env.VITE_API_URL || '/api';
  return fetch(`${API_BASE}/upload/resolution`, {
    method: 'POST',
    body: formData,
  }).then(res => {
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  });
};

export const addIssue = async (formData) => {
  return request('/issues', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

export const getAllIssues = async () => {
  return request('/issues');
};

export const getLatestIssues = async () => {
  return request('/issues/latest');
};

export const getIssueById = async (id) => {
  return request(`/issues/${id}`);
};

export const getMyIssues = async (email) => {
  return request(`/issues/user/${encodeURIComponent(email)}`);
};

export const updateIssue = async (id, updatedData) => {
  return request(`/issues/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedData),
  });
};

export const deleteIssue = async (id) => {
  return request(`/issues/${id}`, {
    method: 'DELETE',
  });
};

export const addContribution = async (contributionData) => {
  return request('/contributions', {
    method: 'POST',
    body: JSON.stringify(contributionData),
  });
};

export const createPaymentOrder = async (paymentData) => {
  return request('/payments/orders', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
};

export const verifyPaymentAndSaveContribution = async (paymentData) => {
  return request('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  });
};

export const getMyContributions = async (email) => {
  return request(`/contributions/user/${encodeURIComponent(email)}`);
};

export const getIssueContributors = async (issueId) => {
  return request(`/contributions/issue/${issueId}`);
};
