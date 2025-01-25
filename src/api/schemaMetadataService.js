import axios from 'axios';

const BASE_URL = '/api/schema-metadata'; // Assuming you have "proxy": "http://localhost:8080" in package.json

export const getAllMetadata = () => {
  return axios.get(BASE_URL);
};

export const createMetadata = (data) => {
  return axios.post(BASE_URL, data);
};

export const updateMetadata = (id, data) => {
  return axios.put(`${BASE_URL}/${id}`, data);
};

export const deleteMetadata = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};
