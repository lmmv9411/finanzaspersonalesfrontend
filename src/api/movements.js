import api from '../constants/api';

export const getMovements = (params) => {
    return api.get('/movements/day', { params });
};

export const deleteMovement = (id) => {
    return api.delete(`/movements/${id}`);
};
