import {
    createBrowserRouter,
    redirect,
    RouterProvider,
} from 'react-router-dom';

import { ReservationGuestLogin } from '@/features/reservation/pages/ReservationGuestLogin';
import { ReservationList } from '@/features/reservation/pages/ReservationList';
import { ReservedTicket } from '@/features/reservation/pages/ReservedTicket';
import { ScheduleSearch } from '@/features/schedule/pages/ScheduleSearch';
import { SelectSeats } from '@/features/schedule/pages/SelectSeats';
import { Layout } from '@/Layout';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { Error } from '@/shared/pages/Error';

const authLoader = (path: string) => {
    const info = sessionStorage.getItem('guestLoginInfo');

    if (path === '/reservationGuestLogin') {
        if (info !== null) {
            return redirect('/reservationList');
        }
        return null;
    }

    if (info === null) {
        alert(ERROR_MESSAGE.SESSION_ERROR);
        return redirect('/reservationGuestLogin');
    }
    return null;
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                loader: () => redirect('/scheduleSearch'),
                errorElement: <Error />,
            },
            {
                path: '/scheduleSearch',
                element: <ScheduleSearch />,
                errorElement: <Error />,
            },
            {
                path: '/selectSeat',
                element: <SelectSeats />,
                errorElement: <Error />,
            },
            {
                path: '/reservedTicket',
                loader: () => authLoader('/reservedTicket'),
                element: <ReservedTicket />,
                errorElement: <Error />,
            },
            {
                path: '/reservationList',
                loader: () => authLoader('/reservationList'),
                element: <ReservationList />,
                errorElement: <Error />,
            },
            {
                path: '/reservationGuestLogin',
                loader: () => authLoader('/reservationGuestLogin'),
                element: <ReservationGuestLogin />,
                errorElement: <Error />,
            },
            { path: '/error', element: <Error /> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
