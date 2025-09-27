import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Main from "../Layouts/Main";
import Register from "../Pages/auth/Register";
import Login from "../Pages/auth/Login";
import DonateFood from "@/Pages/DonateFood/DonateFood";
import FindFood from "@/Pages/FindFood/FindFood";
import FoodDetails from "@/Pages/FoodDetails/FoodDetails";
import MyDonations from "@/Pages/MyDonations/MyDonations";
import MyRequests from "@/Pages/MyRequests/MyRequests";
import About from "@/Pages/About/About";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/donate-food",
        element: <DonateFood />,
      },
      {
        path: "/find-food",
        element: <FindFood />,
      },
      {
        path: "/food/:foodId",
        element: <FoodDetails />,
      },
      {
        path: "/my-donations",
        element: <MyDonations />,
      },
      {
        path: "/my-requests",
        element: <MyRequests />,
      },
      {
        path: "/about",
        element: <About />
      }

    ],
  },
]);
