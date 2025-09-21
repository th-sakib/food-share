import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Routes";
import { ToastContainer } from "react-toastify";

function Main() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className={`font-josefin_sans text-primary-color `}>
      <Main />
      <ToastContainer />
    </div>
  </StrictMode>,
);
