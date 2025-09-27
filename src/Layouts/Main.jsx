import { Outlet } from "react-router-dom";
import Navbar from "../components/Sharable/Navbar";
import MobileNavbar from "../components/Sharable/MobileNavbar";
import Footer from "../components/Sharable/Footer";

const Main = () => {
  return (
    <div className="relative">
      {/* Desktop Navbar - Hidden on mobile */}
      <header className="hidden md:block mx-auto sticky top-0 left-0 z-50 border-b bg-white/80 backdrop-blur-md lg:mb-10">
        <Navbar />
      </header>

      {/* Mobile Navbar - Hidden on desktop */}
      <MobileNavbar />

      {/* Main Content with proper spacing */}
      <div className="flex-1 mt-20 md:mt-20 mb-16 md:mb-0">
        <Outlet />
      </div>

      {/* Footer with proper spacing for mobile bottom nav */}
      <footer className="mx-auto sticky top-0 left-0 -mt-12 z-50 border-b bg-gradient-to-br from-green-50 to-blue-50 mb-16 md:mb-0">
        <Footer />
      </footer>
    </div>
  );
};

export default Main;
