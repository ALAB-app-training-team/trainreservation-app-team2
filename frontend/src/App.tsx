import {
    createBrowserRouter,
    type LoaderFunctionArgs,
    redirect,
    RouterProvider,
} from 'react-router-dom';

import { AuthProvider } from '@/context/AuthContext';
import { Account } from '@/features/account/pages/Account';
import { Login } from '@/features/account/pages/Login';
import { ReservationGuestLogin } from '@/features/reservation/pages/ReservationGuestLogin';
import { ReservationList } from '@/features/reservation/pages/ReservationList';
import { ReservedTicket } from '@/features/reservation/pages/ReservedTicket';
import { ScheduleSearch } from '@/features/schedule/pages/ScheduleSearch';
import { SelectSeats } from '@/features/schedule/pages/SelectSeats';
import { Layout } from '@/Layout';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { Error } from '@/shared/pages/Error';

const reservationListLoader = () => {
    const info = localStorage.getItem('name');
    if (info === null) {
        sessionStorage.setItem('message', ERROR_MESSAGE.LOGIN_ERROR);

        return redirect('/login');
    }
    return null;
};

const reservedTicketLoader = () => {
    const info = sessionStorage.getItem('guestLoginInfo');
    const account = localStorage.getItem('name');
    if (account === null && info === null) {
        alert(ERROR_MESSAGE.SESSION_ERROR);
        return redirect('/scheduleSearch');
    }
    return null;
};

const guestLoginLoader = (request: LoaderFunctionArgs) => {
    const account = localStorage.getItem('name');
    if (account !== null) {
        sessionStorage.setItem('message', ERROR_MESSAGE.EXIST_ACCOUNT);
        return redirect('/reservationList');
    }
    const url = new URL(request.url);
    const targetReservationId = url.searchParams.get('reservationId');
    if (targetReservationId === null) {
        sessionStorage.setItem('message', ERROR_MESSAGE.GUESTLOGIN_ERROR);
        return redirect('/scheduleSearch');
    }
    return null;
};

const loginLoader = () => {
    const account = localStorage.getItem('name');
    if (account !== null) {
        sessionStorage.setItem('message', ERROR_MESSAGE.LOGIN_ALREADY);
        return redirect('/scheduleSearch');
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
                loader: () => loginLoader(),
                element: <Login />,
                errorElement: <Error />,
            },
            {
                path: '/account',
                loader: () => loginLoader(),
                element: <Account />,
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
                loader: () => reservedTicketLoader(),
                element: <ReservedTicket />,
                errorElement: <Error />,
            },
            {
                path: '/reservationList',
                loader: () => reservationListLoader(),
                element: <ReservationList />,
                errorElement: <Error />,
            },
            {
                path: '/reservationGuestLogin',
                loader: (args) => guestLoginLoader(args),
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
