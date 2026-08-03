import { QueryClient } from '@tanstack/react-query';

export const removeGuestReservation = (queryClient: QueryClient) => {
    removeGuestLoginInfo();
    queryClient.removeQueries({ queryKey: ['reservationList'] });
};

export const removeGuestLoginInfo = () => {
    sessionStorage.removeItem('guestLoginInfo');
};
