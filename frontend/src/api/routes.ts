const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${apiBaseUrl}/api`;
const RESERVATION = `${BASE_URL}/shinkansen-reservation`;
const SCHEDULES = `${BASE_URL}/shinkansen-schedule`;
const STATIONS = `${BASE_URL}/shinkansen-station`;
const SEATS = `${BASE_URL}/shinkansen-seat`;
const TRAINCAR = `${BASE_URL}/shinkansen-traincar`;
export const ENDPOINTS = {
  RESERVATION: () => RESERVATION,
  SCHEDULES_SEARCH: () => SCHEDULES,
  STATIONS: () => STATIONS,
  SEATS_SELECT: () => SEATS,
  TRAINCAR: () => TRAINCAR,
};
