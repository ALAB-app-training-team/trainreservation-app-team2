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
import { Error } from '@/shared/pages/Error';

const authLoader = () => {
    const info = sessionStorage.getItem('guestLoginInfo');

    if (info === null) {
        alert('セッションが切れました。再ログインしてください。');
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
                loader: () => authLoader(),
                element: <ReservedTicket />,
                errorElement: <Error />,
            },
            {
                path: '/reservationList',
                loader: () => authLoader(),
                element: <ReservationList />,
                errorElement: <Error />,
            },
            {
                path: '/reservationGuestLogin',
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
