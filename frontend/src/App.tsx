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
        // toast.warning(ERROR_MESSAGE.LOGIN_ERROR);
        sessionStorage.setItem('message', ERROR_MESSAGE.EXIST_ACCOUNT);

        return redirect('/login');
    }
    return null;
};

const authLoader = () => {
    const info = sessionStorage.getItem('guestLoginInfo');
    const account = localStorage.getItem('name');
    if (account === null && info === null) {
        alert(ERROR_MESSAGE.SESSION_ERROR);
        return redirect('/reservationGuestLogin');
    }
    return null;
};

const guestLoginLoader = () => {
    const account = localStorage.getItem('name');
    if (account !== null) {
        sessionStorage.setItem('message', ERROR_MESSAGE.EXIST_ACCOUNT);
        // toast.warning(ERROR_MESSAGE.EXIST_ACCOUNT);
        return redirect('/login');
    }
    // const url = new URL(request.url);
    // const targetReservationId = url.searchParams.get('reservationId');
    // // const account = localStorage.getItem('name');
    // if (targetReservationId === null) {
    //     toast.warning(ERROR_MESSAGE.GUESTLOGIN_ERROR); // TODO:ここの「Toastがでない。リダイレクトはされる」を修正する
    //     return redirect('/scheduleSearch');
    // }
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
                // loader: (args) => guestLoginLoader(args),
                loader: () => guestLoginLoader(),
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
