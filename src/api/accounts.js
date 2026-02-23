import api from '../constants/api';

export const getAccounts = () => api.get('/accounts');

export const createAccount = (payload) => api.post('/accounts', payload);

export const updateAccount = (id, payload) => api.put(`/accounts/${id}`, payload);

export const deleteAccount = (id) => api.delete(`/accounts/${id}`);
