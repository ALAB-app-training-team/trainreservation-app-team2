const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${apiBaseUrl}/api`;
const SCHEDULES = `${BASE_URL}/shinkansen-schedule`;
export const ENDPOINTS = { SCHEDULES_SEARCH: () => SCHEDULES };
