import axios from '../index';

// Create a new project
export const createProject = (data: any) => axios.post('/api/projects', data);

// Delete a project by id
export const deleteProject = (id: string) => axios.delete(`/api/projects/${id}`);

// Trigger video generation for a project
export const generateVideo = (id: string) => axios.post(`/api/projects/${id}/generate-video`);
