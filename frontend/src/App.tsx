import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { ScheduleSearch } from "./features/schedule/pages/ScheduleSearch";
import { SelectSeats } from "./features/schedule/pages/SelectSeats";
import { Error } from "./shared/pages/Error";
import { Header } from "./shared/components/Header";

import { ReservedTicket } from "./features/reservation/pages/ReservedTicket";

function Layout() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-10 bg-white">
          <Header />
        </div>
        <div className="flex-1 w-full min-w-[375px] overflow-x-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        loader: () => redirect("/searchResult"),
        errorElement: <Error />,
      },
      {
        path: "/searchResult",
        element: <ScheduleSearch />,
        errorElement: <Error />,
      },
      {
        path: "/selectSeat",
        element: <SelectSeats />,
        errorElement: <Error />,
      },
      {
        path: "/reservedTicket",
        element: <ReservedTicket />,
        errorElement: <Error />,
      },
      { path: "/error", element: <Error /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
