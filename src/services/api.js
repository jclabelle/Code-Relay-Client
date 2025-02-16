import axios from 'axios';

const API_URL = 'http://localhost:5000/api/CodebaseExplorer';

export const getDirectories = async (path = '') => {
  const response = await axios.get(`${API_URL}/directories`, { params: { path } });
  return response.data;
};

export const analyzeDirectory = async (path) => {
  const response = await axios.post(`${API_URL}/analyze`, path);
  return response.data;
};

export const getNamespaces = async () => {
  const response = await axios.get(`${API_URL}/namespaces`);
  return response.data;
};

export const getTypesInNamespace = async (namespace) => {
  const response = await axios.get(`${API_URL}/namespaces/${namespace}/types`);
  return response.data;
};

export const getMembersInType = async (namespace, typeName) => {
  const response = await axios.get(`${API_URL}/types/${namespace}/${typeName}/members`);
  return response.data;
};

export const searchTypes = async (query) => {
  const response = await axios.get(`${API_URL}/search/types`, { params: { query } });
  return response.data;
};

export const searchMembers = async (query) => {
  const response = await axios.get(`${API_URL}/search/members`, { params: { query } });
  return response.data;
};