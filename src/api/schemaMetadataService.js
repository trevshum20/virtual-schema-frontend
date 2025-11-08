import { api } from './client';

const ENDPOINT_URL = '/api/schema-metadata';

export const getAllMetadata = () => {
  return api.get(ENDPOINT_URL);
};

export const createMetadata = (data) => {
  return api.post(ENDPOINT_URL, data);
};

export const updateMetadata = (id, data) => {
  return api.put(`${ENDPOINT_URL}/${id}`, data);
};

export const deleteMetadata = (id) => {
  return api.delete(`${ENDPOINT_URL}/${id}`);
};
