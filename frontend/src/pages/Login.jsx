import React, { useState } from "react";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authAPI.login({
        email,
        password,
      });

      const user = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        toast.success("Welcome Admin", {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
        });
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-200 p-6">
      <div className="w-full max-w-md bg-zinc-300 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="border-b-4 border-black p-6 bg-white flex items-center justify-between">
          <h1 className="font-bitcount text-5xl font-light">Login</h1>

          <Link
            to="/"
            className="text-sm font-bold uppercase underline decoration-4 decoration-amber-500 hover:text-amber-600"
          >
            ← Home
          </Link>
        </div>

        {/* Form */}
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
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 border-4 border-black py-4 text-xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Register Link */}
          <p className="text-sm font-bold uppercase text-center">
            New here?{" "}
            <Link
              to="/register"
              className="underline decoration-4 decoration-amber-500 hover:bg-amber-500"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
