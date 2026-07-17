import { QueryClient } from '@tanstack/react-query';

export const removeGuestReservation = (queryClient: QueryClient) => {
    sessionStorage.removeItem('guestLoginInfo');
    queryClient.removeQueries({ queryKey: ['reservationList'] });
};
