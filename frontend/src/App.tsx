import {
    createBrowserRouter,
    redirect,
    RouterProvider,
} from 'react-router-dom';

import { AuthProvider } from '@/context/AuthContext';
import { Login } from '@/features/account/pages/Login';
import { ReservationGuestLogin } from '@/features/reservation/pages/ReservationGuestLogin';
import { ReservationList } from '@/features/reservation/pages/ReservationList';
import { ReservedTicket } from '@/features/reservation/pages/ReservedTicket';
import { ScheduleSearch } from '@/features/schedule/pages/ScheduleSearch';
import { SelectSeats } from '@/features/schedule/pages/SelectSeats';
import { Layout } from '@/Layout';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { Error } from '@/shared/pages/Error';

const sessionLoader = () => {
    const info = localStorage.getItem('name');
    if (info === null) {
        alert(ERROR_MESSAGE.SESSION_ERROR);
        return redirect('/login');
    }
    return null;
};

const authLoader = () => {
    const info = sessionStorage.getItem('guestLoginInfo');

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
                path: '/login',
                element: <Login />,
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
                loader: () => sessionLoader(),
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
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
