import axios, { HttpStatusCode } from 'axios';

const apiClient = axios.create({
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = error.config?.url || '';
        const requestMethod = error.config?.method?.toLowerCase() || '';
        const isPostReservation =
            requestMethod === 'post' && requestUrl.includes('/reservations');

        if (
            error.response &&
            error.response.status === HttpStatusCode.Unauthorized
        ) {
            localStorage.clear();
            sessionStorage.clear();

            if (isPostReservation) {
                // 予約時のセッション切れ対応
                return Promise.reject(error);
            }

            window.location.href = `/login`;
            return Promise.reject();
        }
        return Promise.reject(error);
    },
);

export default apiClient;
