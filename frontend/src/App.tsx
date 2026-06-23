import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { SearchResult } from "./features/schedule/pages/SearchResult";
import { SearchSchedule } from "./features/schedule/pages/SearchSchedule";
import { SelectSeats } from "./features/schedule/pages/SelectSeat";
import { Error } from "./shared/pages/Error";
import { Header } from "./shared/components/Header";

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
        loader: () => redirect("/searchSchedule"),
        errorElement: <Error />,
      },
      {
        path: "/searchResult",
        element: <SearchResult />,
        errorElement: <Error />,
      },
      {
        path: "/searchSchedule",
        element: <SearchSchedule />,
        errorElement: <Error />,
      },
      {
        path: "/selectSeat",
        element: <SelectSeats />,
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
