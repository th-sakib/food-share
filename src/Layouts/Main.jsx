import { Outlet } from "react-router-dom";
import Navbar from "../components/Sharable/Navbar";
import Footer from "../components/Sharable/Footer";

const Main = () => {
  return (
    <div className="relative">
      <header className="mx-auto sticky top-0 left-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <Navbar />
      </header>
      <div className="text-primary-color bg-gradient-to-br from-green-50 to-blue-50">
        <Outlet />
      </div>
      <footer className="mx-auto sticky top-0 left-0 -mt-12 z-50 border-b bg-gradient-to-br from-green-50 to-blue-50">
        <Footer />
      </footer>
    </div>
  );
};

export default Main;
