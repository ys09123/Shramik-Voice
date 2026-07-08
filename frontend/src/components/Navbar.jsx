import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Shared Navbar component for all pages.
 *
 * variant="public"  → Logo + Login + Register buttons          (Home)
 * variant="worker"  → Logo + Welcome [name] + Logout           (Dashboard)
 * variant="admin"   → Logo (black) + Admin badge + Logout      (AdminDashboard)
 * variant="back"    → Logo + ← Back button                     (LodgeGrievance)
 */
const Navbar = ({ variant = "public", onLogout, userName }) => {
  const navigate = useNavigate();

  const isAdmin = variant === "admin";

  return (
    <nav className="border-b-4 border-black bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* ── Brand ── */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => navigate("/")}
          className={`w-10 h-10 border-4 border-black flex items-center justify-center font-black text-lg cursor-pointer transition-colors
            ${isAdmin ? "bg-black text-amber-400" : "bg-amber-500 text-black hover:bg-amber-400"}`}
        >
          SV
        </div>
        <div className="flex items-center">
          <span className="font-black text-xl uppercase tracking-tight cursor-pointer" onClick={() => navigate("/")}>
            Shramik Voice
          </span>
          {isAdmin && (
            <span className="ml-3 bg-amber-500 border-2 border-black px-2 py-0.5 text-xs font-black uppercase">
              Admin
            </span>
          )}
        </div>
      </div>

      {/* ── Right side ── */}
      <div className="flex items-center gap-3">
        {/* PUBLIC: Login + Register */}
        {variant === "public" && (
          <>
            <button
              onClick={() => navigate("/login")}
              className="border-4 border-black px-5 py-2 font-bold uppercase text-sm hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="border-4 border-black px-5 py-2 font-bold uppercase text-sm bg-amber-500 hover:bg-amber-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              Register
            </button>
          </>
        )}

        {/* WORKER: Welcome + Logout */}
        {variant === "worker" && (
          <>
            <span className="font-bold uppercase text-sm text-zinc-600 hidden sm:block">
              <span className="font-bold text-black">Welcome</span>{" "}
              {userName || "Worker"}!
            </span>
            <button
              onClick={onLogout}
              className="border-4 border-black px-4 py-2 font-bold uppercase text-sm hover:bg-red-400 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
            >
              Logout
            </button>
          </>
        )}

        {/* ADMIN: Logout */}
        {variant === "admin" && (
          <button
            onClick={onLogout}
            className="border-4 border-black px-4 py-2 font-bold uppercase text-sm hover:bg-red-400 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
          >
            Logout
          </button>
        )}

        {/* BACK: ← Back button */}
        {variant === "back" && (
          <button
            onClick={() => navigate(-1)}
            className="border-4 border-black px-4 py-2 font-bold uppercase text-sm hover:bg-zinc-100 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
          >
            ← Back
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
