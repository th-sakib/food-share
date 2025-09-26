import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { toast } from "react-toastify";
import { createUser } from "@/api/userApi";

const googleProvider = new GoogleAuthProvider();

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // body is empty because those should be created in backend from firebase data
      const userData = await createUser(); // create user in backend
      console.log("userData: ", userData);

      if (userData) {
        setLoading(false);
        navigate("/");

        toast.success("Registration successful!", {
          position: "top-center",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error registering user:", error);
      if (error.message.split(": ")[2]) {
        toast.error(
          error.message.split(": ")[1] + error.message.split(": ")[2],
          {
            position: "top-center",
          },
        );
      } else {
        toast.error(error.message.split(": ")[1], {
          position: "top-center",
        });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    try {
      const userCredentials = await signInWithPopup(auth, googleProvider);
      const user = userCredentials.user;

      // body is empty because those should be created in backend from firebase data
      const userData = await createUser(); // create user in backend
      console.log("userData: ", userData);

      if (userData) {
        setLoadingGoogle(false);
        navigate("/");
        toast.success("Google sign-in successful!", {
          position: "top-center",
        });
      }
    } catch (error) {
      setLoadingGoogle(false);
      console.error("Error signing in with Google:", error);
      toast.error("Google sign-in failed. Please try again.", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {/* Google login button */}

          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            {loadingGoogle ? "Signing in..." : "Sign in with Google"}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
export default Register;
