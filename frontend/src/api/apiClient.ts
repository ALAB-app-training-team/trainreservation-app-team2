import axios, { HttpStatusCode } from 'axios';

const apiClient = axios.create({
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            error.response.status === HttpStatusCode.Unauthorized &&
            !window.location.pathname.startsWith('/reservationGuestLogin')
        ) {
            localStorage.clear();
            sessionStorage.clear();

            window.location.href = `/login`;
            return Promise.reject();
        }
        return Promise.reject(error);
    },
);

export default apiClient;
