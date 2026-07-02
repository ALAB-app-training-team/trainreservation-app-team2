import {
    createBrowserRouter,
    Outlet,
    redirect,
    RouterProvider,
} from 'react-router-dom';

import { ReservedTicket } from '@/features/reservation/pages/ReservedTicket';
import { ScheduleSearch } from '@/features/schedule/pages/ScheduleSearch';
import { SelectSeats } from '@/features/schedule/pages/SelectSeats';
import { Header } from '@/shared/components/Header';
import { Error } from '@/shared/pages/Error';

function Layout() {
    return (
        <>
            <div className="flex min-h-screen flex-col">
                <div className="sticky top-0 z-10 bg-white">
                    <Header />
                </div>
                <div className="w-full min-w-[375px] flex-1 overflow-x-auto">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

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
            { path: '/error', element: <Error /> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
