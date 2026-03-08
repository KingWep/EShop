import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://e-shop-1-m034.onrender.com/api/v1/public/login",
        {
          username,
          password,
        }
      );

      console.log("FULL RESPONSE:", response);

      const token = response.data.access_token;
      console.log("Token:", token);

      if (!token) {
        throw new Error("Token not found in response");
      }

      // Save token
      localStorage.setItem("token", token);
      // console.log("Token saved to localStorage", localStorage.getItem("token"));
      
      // Optional: set default header for future requests
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      // Redirect
      navigate("/");

    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-600">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">
          Sign in
        </h2>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 px-4 py-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Password */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 rounded-lg bg-indigo-600 text-black hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {isLoading ? (
              <span>Loading...</span>
            ) : (
              <>
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;