const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${apiBaseUrl}/api`;
const SCHEDULES = `${BASE_URL}/schedules`;
const STATIONS = `${BASE_URL}/stations`;
const STOPSTATIONS = `${BASE_URL}/stopstations`;
const TRAINCARS = `${BASE_URL}/traincars`;
const RESERVATION = `${BASE_URL}/reservations`;
const PAYMENT = `${BASE_URL}/payments`;

export const ENDPOINTS = {
    PAYMENT_TOKEN: () => `${PAYMENT}/tokens`,
    RESERVATION: (id?: string) => (id ? `${RESERVATION}/${id}` : RESERVATION),
    SCHEDULES_SEARCH: () => SCHEDULES,
    STATIONS: () => STATIONS,
    STOPSTATIONS: () => STOPSTATIONS,
    SEATS_SELECT: (trainCarCd: string) => `${TRAINCARS}/${trainCarCd}/seats`,
    TRAINCAR: (id: string) => `${SCHEDULES}/${id}/traincars`,
};
