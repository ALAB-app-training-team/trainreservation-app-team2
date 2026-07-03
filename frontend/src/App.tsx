import {
    createBrowserRouter,
    redirect,
    RouterProvider,
} from 'react-router-dom';

import { ReservationList } from '@/features/reservation/pages/ReservationList';
import { ReservedTicket } from '@/features/reservation/pages/ReservedTicket';
import { ScheduleSearch } from '@/features/schedule/pages/ScheduleSearch';
import { SelectSeats } from '@/features/schedule/pages/SelectSeats';
import { Layout } from '@/Layout';
import { Error } from '@/shared/pages/Error';

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
                element: <ReservedTicket />,
                errorElement: <Error />,
            },
            {
                path: '/reservationList',
                element: <ReservationList />,
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
