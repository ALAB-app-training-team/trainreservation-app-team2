import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useRouteError,
} from "react-router-dom";
import "./App.css";
import { SearchResult } from "./features/schedule/pages/SearchResult";
import { Error } from "./shared/pages/Error";
import { Header } from "./shared/components/Header";

function Layout() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-white">
        <Header />
      </div>
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <SearchResult />, errorElement: <Error /> },
      {
        path: "/searchResult",
        element: <SearchResult />,
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
