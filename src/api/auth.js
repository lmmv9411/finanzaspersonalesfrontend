import api from '../constants/api';

export const checkAuth = () => {
    return api.get('/auth/check', { withCredentials: true });
};
