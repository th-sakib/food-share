import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const firebase = useAuth();
  console.log(firebase)
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Left: Logo/Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-primary"
        >
          <span role="img" aria-label="food">

          </span>{" "}
          FoodShare
        </Link>
        {/* Center: Navigation Links */}
        <div className="hidden md:flex gap-6 text-base font-medium">
          <Link to="/" className="hover:text-primary transition">
            Home
          </Link>
          <Link to="/browse" className="hover:text-primary transition">
            Browse Food
          </Link>
          <Link to="/donate-food" className="hover:text-primary transition">
            Add Food
          </Link>
          <Link to="/impact" className="hover:text-primary transition">
            Impact
          </Link>
          <Link to="/about" className="hover:text-primary transition">
            About
          </Link>
        </div>
        {/* Right: Login/Signup or Profile */}
        <div className="flex items-center gap-4">
          {!firebase.currentUser ? (
            <Button
              variant="outline"
              onClick={handleLoginClick}
              className="border-primary text-primary"
            >
              Login
            </Button>
          ) : (
            // Sidepanel: Profile and Logout
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:cursor-pointer"
                >
                  <span className="material-icons">
                    <Avatar>
                      <AvatarImage src={firebase.currentUser?.photoURL} alt="profile" />
                      <AvatarFallback>🌍</AvatarFallback>
                    </Avatar>
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 px-4">
                <div className="flex flex-col gap-4 mt-8">
                  <Link to="/profile" className="hover:text-primary transition">
                    Profile
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-primary"
                  >
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;