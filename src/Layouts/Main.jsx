import { Outlet } from "react-router-dom";
import Navbar from "../components/Sharable/Navbar";
import Footer from "../components/Sharable/Footer";

const Main = () => {
  return (
    <div className="relative">
      <header className="mx-auto sticky top-0 left-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <Navbar />
      </header>
      <div className="text-primary-color bg-amber-500/20">
        <Outlet />
      </div>
      <header className="mx-auto sticky top-0 left-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <Footer />
      </header>
    </div>
  );
};

export default Main;
