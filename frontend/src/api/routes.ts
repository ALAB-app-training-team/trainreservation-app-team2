const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${apiBaseUrl}/api`;
const LOGIN = `${BASE_URL}/login`;
const PAYMENT = `${BASE_URL}/payments`;
const RESERVATION = `${BASE_URL}/reservations`;
const SCHEDULES = `${BASE_URL}/schedules`;
const STATIONS = `${BASE_URL}/stations`;
const STOPSTATIONS = `${BASE_URL}/stopstations`;
const TRAINCARS = `${BASE_URL}/traincars`;

export const ENDPOINTS = {
    LOGIN: () => LOGIN,
    PAYMENT_TOKEN: () => `${PAYMENT}/tokens`,
    RESERVATION: (id?: string) => (id ? `${RESERVATION}/${id}` : RESERVATION),
    SCHEDULES_SEARCH: () => SCHEDULES,
    SEATS_SELECT: () => `${TRAINCARS}/seats`,
    STATIONS: () => STATIONS,
    STOPSTATIONS: () => STOPSTATIONS,
    TRAINCAR: (id: string) => `${SCHEDULES}/${id}/traincars`,
};
