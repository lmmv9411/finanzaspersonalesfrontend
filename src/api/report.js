import api from "../constants/api";

export const getMonthlyReport = async () => {
    return await api.get('/stats/monthly')
};
