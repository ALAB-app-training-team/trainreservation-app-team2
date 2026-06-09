import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { SearchResult } from "./features/schedule/pages/SearchResult";
import { SearchSchedule } from "./features/schedule/pages/SearchSchedule";
import { Error } from "./shared/pages/Error";
import { Header } from "./shared/components/Header";

function Layout() {
  return (
    <>
      <div className="sticky top-0 z-10 bg-white">
        <Header />
      </div>
      <div className="min-h-screen w-full min-w-[375px] overflow-x-auto">
        <Outlet />
      </div>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <SearchSchedule />, errorElement: <Error /> },
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
      { path: "/error", element: <Error /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
