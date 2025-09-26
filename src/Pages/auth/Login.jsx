import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../lib/firebase";
import { toast } from "react-toastify";
import { GoogleAuthProvider } from "firebase/auth";
import { createUser } from "@/api/userApi";

const googleProvider = new GoogleAuthProvider();

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";
  const redirectMessage = location.state?.message;

  // Show redirect message if present
  useEffect(() => {
    if (redirectMessage) {
      toast.info(redirectMessage, {
        position: "top-center",
      });
    }
  }, [redirectMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // show notification
      if (user) {
        setLoading(false);
        navigate(from);
        toast.success("Login successful!", {
          position: "top-center",
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error logging in user:", error);

      // show error message
      switch (error.code) {
        case "auth/invalid-email":
          toast.error("The email address is invalid.", {
            position: "top-center",
          });
          break;
        case "auth/user-not-found":
          toast.error("No account found with this email.", {
            position: "top-center",
          });
          break;
        case "auth/wrong-password":
          toast.error("Incorrect password. Please try again.", {
            position: "top-center",
          });
          break;
        default:
          toast.error("An unexpected error occurred. Please try again.", {
            position: "top-center",
          });
          break;
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoadingGoogle(true);
      const userCredentials = await signInWithPopup(auth, googleProvider);
      const user = userCredentials.user;

      // body is empty because those should be created in backend from firebase data
      const userData = await createUser(); // create user in backend
      console.log("userData: ", userData);

      if (userData) {
        setLoadingGoogle(false);
        navigate(from);
        toast.success("Login successful!", {
          position: "top-center",
        });
      }
    } catch (error) {
      setLoadingGoogle(false);
      console.error("Error signing in with Google:", error);
      toast.error("Failed to sign in with Google. Please try again.", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate(from);
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
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email:
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password:
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            type="submit"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
          {/* Google login */}
          <div>
            <p>or</p> <br></br>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              type="button"
              onClick={signInWithGoogle}
            >
              {loadingGoogle ? "Signing in..." : "Sign in with Google"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
