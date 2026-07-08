import React, { useState } from "react";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await authAPI.register({ email, name, password });
      toast.success("Account created! Please log in.", {
        style: {
          border: "4px solid #000",
          padding: "16px",
          fontWeight: "700",
          textTransform: "uppercase",
          fontSize: "0.8rem",
        },
        iconTheme: {
          primary: "#f59e0b",
          secondary: "#000",
        },
      });
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-200 p-6">
      <div className="w-full max-w-md bg-zinc-300 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-black p-6 bg-white flex items-center justify-between">
          <h1 className="font-bitcount text-5xl font-light">Register</h1>
          <Link
            to="/"
            className="text-sm font-bold uppercase underline decoration-4 decoration-amber-500 hover:text-amber-600"
          >
            ← Home
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="border-4 border-black bg-red-400 px-4 py-3 font-bold uppercase text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg uppercase">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 border-4 border-black bg-white px-4 text-lg outline-none focus:bg-amber-200 transition-colors placeholder:text-zinc-400"
                placeholder="ENTER EMAIL"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg uppercase">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 border-4 border-black bg-white px-4 text-lg outline-none focus:bg-amber-200 transition-colors placeholder:text-zinc-400"
                placeholder="ENTER NAME"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 border-4 border-black bg-white px-4 text-lg outline-none focus:bg-amber-200 transition-colors placeholder:text-zinc-400"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg uppercase">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full h-14 border-4 border-black bg-white px-4 text-lg outline-none transition-colors placeholder:text-zinc-400 ${
                  confirmPassword && confirmPassword !== password
                    ? "bg-red-100 border-red-500 focus:bg-red-100"
                    : "focus:bg-amber-200"
                }`}
                placeholder="••••••••"
                required
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="text-xs font-bold uppercase text-red-600">
                  Passwords do not match
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 border-4 border-black py-4 text-xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-sm font-bold uppercase text-center">
            Returning user?{" "}
            <Link
              to="/login"
              className="underline decoration-4 decoration-amber-500 hover:bg-amber-500"
            >
              Log in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
