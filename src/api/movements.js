import api from '../constants/api';
import { useDateFilters } from '../composables/useDates';

export const getMovements = (params) => {
    const { getTimezoneOffsetString } = useDateFilters()
    const tz = getTimezoneOffsetString();
    return api.get(`/movements/day?tz=${tz}`, { params });
};

export const deleteMovement = (id) => {
    return api.delete(`/movements/${id}`);
};
