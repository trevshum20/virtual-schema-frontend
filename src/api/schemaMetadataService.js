import axios from 'axios';

const BASE_URL = '/api/schema-metadata'; // Assuming you have "proxy": "http://localhost:8080" in package.json

export const getAllMetadata = () => {
  return axios.get(BASE_URL, { withCredentials: true });
};

export const createMetadata = (data) => {
  return axios.post(BASE_URL, data, { withCredentials: true });
};

export const updateMetadata = (id, data) => {
  return axios.put(`${BASE_URL}/${id}`, data, { withCredentials: true });
};

export const deleteMetadata = (id) => {
  return axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });
};
