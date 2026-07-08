const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${apiBaseUrl}/api`;
const SCHEDULES = `${BASE_URL}/shinkansen-schedule`;
const STATIONS = `${BASE_URL}/shinkansen-station`;
const SEATS = `${BASE_URL}/shinkansen-seat`;
const TRAINCAR = `${BASE_URL}/shinkansen-traincar`;
const RESERVATION = `${BASE_URL}/api/reservations`;
const PAYMENT = `${BASE_URL}/api/payments`;

export const ENDPOINTS = {
    PAYMENT: () => `${PAYMENT}/token`,
    RESERVATION: (id?: string) => (id ? `${RESERVATION}/${id}` : RESERVATION),
    SCHEDULES_SEARCH: () => SCHEDULES,
    STATIONS: () => STATIONS,
    SEATS_SELECT: () => SEATS,
    TRAINCAR: () => TRAINCAR,
};
