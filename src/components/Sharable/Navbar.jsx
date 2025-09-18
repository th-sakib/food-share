import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLoginClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFakeLogin = () => {
    setLoggedIn(true);
    setShowModal(false);
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Left: Logo/Brand */}
        <a
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-primary"
        >
          <span role="img" aria-label="food">
            🍲
          </span>{" "}
          FoodShare
        </a>
        {/* Center: Navigation Links */}
        <div className="hidden md:flex gap-6 text-base font-medium">
          <a href="/" className="hover:text-primary transition">
            Home
          </a>
          <a href="/browse" className="hover:text-primary transition">
            Browse Food
          </a>
          <a href="/add" className="hover:text-primary transition">
            Add Food
          </a>
          <a href="/impact" className="hover:text-primary transition">
            Impact
          </a>
          <a href="/about" className="hover:text-primary transition">
            About
          </a>
        </div>
        {/* Right: Login/Signup or Profile */}
        <div className="flex items-center gap-4">
          {!loggedIn ? (
            <Button
              variant="outline"
              onClick={handleLoginClick}
              className="border-primary text-primary"
            >
              Login / Signup
            </Button>
          ) : (
            <Avatar>
              <AvatarImage src="" alt="profile" />
              <AvatarFallback>🌍</AvatarFallback>
            </Avatar>
          )}
          {/* Mobile Nav Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:cursor-pointer"
              >
                <span className="material-icons">
                  <Menu />
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                <a href="/" className="hover:text-primary transition">
                  Home
                </a>
                <a href="/browse" className="hover:text-primary transition">
                  Browse Food
                </a>
                <a href="/add" className="hover:text-primary transition">
                  Add Food
                </a>
                <a href="/impact" className="hover:text-primary transition">
                  Impact
                </a>
                <a href="/about" className="hover:text-primary transition">
                  About
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* Modal for Login/Signup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[300px]">
            <h2 className="text-xl font-bold mb-4">Login / Signup</h2>
            <Button onClick={handleFakeLogin} className="w-full mb-2">
              Fake Login
            </Button>
            <Button
              variant="outline"
              onClick={handleCloseModal}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
