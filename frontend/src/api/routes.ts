const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${apiBaseUrl}/api`;
const SCHEDULES = `${BASE_URL}/shinkansen-schedule`;
const STATIONS = `${BASE_URL}/shinkansen-station`;
const SEATS = `${BASE_URL}/shinkansen-seat`;
export const ENDPOINTS = {
  SCHEDULES_SEARCH: () => SCHEDULES,
  STATIONS: () => STATIONS,
  SEATS_SELECT: () => SEATS,
};
