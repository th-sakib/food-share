import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  X,
  Home,
  Search,
  Plus,
  Heart,
  User,
  LogOut,
  Info,
  Package,
  MessageCircle,
} from "lucide-react";

const MobileNavbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginClick = () => {
    navigate("/login");
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navigationLinks = [
    {
      to: "/",
      label: "Home",
      icon: <Home className="w-5 h-5" />,
    },
    {
      to: "/find-food",
      label: "Browse Food",
      icon: <Search className="w-5 h-5" />,
    },
    {
      to: "/donate-food",
      label: "Add Food",
      icon: <Plus className="w-5 h-5" />,
      requireAuth: true,
    },
    {
      to: "/about",
      label: "About",
      icon: <Info className="w-5 h-5" />,
    },
  ];

  const userLinks = [
    {
      to: "/my-donations",
      label: "My Donations",
      icon: <Package className="w-5 h-5" />,
    },
    {
      to: "/my-requests",
      label: "My Requests",
      icon: <MessageCircle className="w-5 h-5" />,
    },
  ];

  // Bottom navigation links (excluding About)
  const bottomNavLinks = [
    {
      to: "/",
      label: "Home",
      icon: <Home className="w-5 h-5" />,
    },
    {
      to: "/find-food",
      label: "Browse Food",
      icon: <Search className="w-5 h-5" />,
    },
    {
      to: "/donate-food",
      label: "Add Food",
      icon: <Plus className="w-5 h-5" />,
      requireAuth: true,
    },
  ];

  return (
    <>
      {/* Mobile Navbar - Only visible on small screens */}
      <nav className="md:hidden w-full fixed top-0 left-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-green-600"
            onClick={closeMenu}
          >
            <span role="img" aria-label="food">
              🍽️
            </span>
            FoodShare
          </Link>

          {/* Right side: User Avatar or Login + Menu Button */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser?.photoURL} alt="profile" />
                <AvatarFallback className="bg-green-100 text-green-700 text-sm">
                  {currentUser?.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            )}

            {/* Hamburger Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              {/* Main Navigation Links */}
              <div className="space-y-2">
                {navigationLinks.map((link) => {
                  // Skip auth-required links if user is not logged in
                  if (link.requireAuth && !currentUser) return null;

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActiveRoute(link.to)
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* User Authentication Section */}
              {!currentUser ? (
                <div className="space-y-2">
                  <Button
                    onClick={handleLoginClick}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login / Sign Up
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-3 py-2 bg-green-50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser?.photoURL} alt="profile" />
                      <AvatarFallback className="bg-green-200 text-green-800 text-sm">
                        {currentUser?.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-900 truncate">
                        {currentUser?.displayName || "User"}
                      </p>
                      <p className="text-xs text-green-600 truncate">
                        {currentUser?.email}
                      </p>
                    </div>
                  </div>

                  {/* User-specific Links */}
                  {userLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActiveRoute(link.to)
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}

                  {/* Logout Button */}
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Tab Bar - Alternative mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-4 gap-1">
          {bottomNavLinks.map((link) => {
            // Skip auth-required links if user is not logged in
            if (link.requireAuth && !currentUser) return null;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center justify-center py-2 px-1 text-xs font-medium transition-colors ${
                  isActiveRoute(link.to)
                    ? "text-green-600 bg-green-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {link.icon}
                <span className="mt-1">{link.label.split(" ")[0]}</span>
              </Link>
            );
          })}

          {/* Profile/Login Tab */}
          {currentUser ? (
            <Link
              to="/my-donations"
              className={`flex flex-col items-center justify-center py-2 px-1 text-xs font-medium transition-colors ${
                isActiveRoute("/my-donations") || isActiveRoute("/my-requests")
                  ? "text-green-600 bg-green-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="mt-1">Donations</span>
            </Link>
          ) : (
            <button
              onClick={handleLoginClick}
              className="flex flex-col items-center justify-center py-2 px-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="mt-1">Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Spacer for bottom tab bar */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default MobileNavbar;
