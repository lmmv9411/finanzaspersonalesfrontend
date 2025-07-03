import api from '../constants/api';

export const getBalance = (params) => {
    return api.get('/movements/balance', { params });
};
