import axios from '../index';

// Get user credit
export const getUserCredit = () => axios.get('/api/users/credits');

// Get all user projects (can pass params for filter, search, sort...)
export const getAllUserProjects = (params?: any) => axios.get('/api/users/projects', { params });

// Get project by id
export const getProjectById = (id: string) => axios.get(`/api/users/projects/${id}`);

// Toggle publish/unpublish project
export const toggleProjectPublish = (id: string) => axios.patch(`/api/users/projects/${id}/toggle-publish`);