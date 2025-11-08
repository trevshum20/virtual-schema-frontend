import { api } from './client';        // our axios instance
import { setToken } from '../auth/token';

export async function login(username, password) {
  const res = await api.post('/auth/login', { username, password });
  const { token } = res.data;
  setToken(token);
  return token;
}
