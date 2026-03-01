import { useDateFilters } from "../composables/useDates";
import api from "../constants/api";

export const getMonthlyReport = async () => {
    const { getTimezoneOffsetString } = useDateFilters();
    const tz = getTimezoneOffsetString()
    return await api.get(`/stats/monthly?tz=${tz}`)
};
