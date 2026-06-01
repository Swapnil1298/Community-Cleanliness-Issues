import { request } from './apiClient';

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

export const getMyContributions = async (email) => {
  return request(`/contributions/user/${encodeURIComponent(email)}`);
};

export const getIssueContributors = async (issueId) => {
  return request(`/contributions/issue/${issueId}`);
};
