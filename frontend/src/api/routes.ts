const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${apiBaseUrl}/api`;
const LOGIN = `${BASE_URL}/login`;
const LOGOUT = `${BASE_URL}/logout`;
const PAYMENT = `${BASE_URL}/payments`;
const RESERVATION = `${BASE_URL}/reservations`;
const RESERVEDSEAT = `${BASE_URL}/reservedseats`;
const SCHEDULES = `${BASE_URL}/schedules`;
const STATIONS = `${BASE_URL}/stations`;
const STOPSTATIONS = `${BASE_URL}/stopstations`;
const TRAINCARS = `${BASE_URL}/traincars`;

export const ENDPOINTS = {
    LOGIN: () => LOGIN,
    LOGOUT: () => LOGOUT,
    PAYMENT_TOKEN: () => `${PAYMENT}/tokens`,
    RESERVATION: (id?: string) => (id ? `${RESERVATION}/${id}` : RESERVATION),
    RESERVATION_SEAT_UPDATE: (id: string) => `${RESERVATION}/seat/${id}`,
    GUESTRESERVATION: (id?: string) =>
        id ? `${RESERVATION}/guest/${id}` : `${RESERVATION}/guest`,
    RESERVEDSEAT: (id?: string) => `${RESERVEDSEAT}/${id}`,
    SCHEDULES_SEARCH: () => SCHEDULES,
    SEATS_SELECT: () => `${TRAINCARS}/seats`,
    STATIONS: () => STATIONS,
    STOPSTATIONS: () => STOPSTATIONS,
    TRAINCAR: (id: string) => `${SCHEDULES}/${id}/traincars`,
};
