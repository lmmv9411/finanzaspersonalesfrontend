import api from '../constants/api';

export const getTransfers = (params) => api.get('/transfers', { params });

export const createTransfer = (payload) => api.post('/transfers', payload);

export const deleteTransfer = (id) => api.delete(`/transfers/${id}`);
