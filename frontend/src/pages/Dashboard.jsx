import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { grievanceAPI } from "../services/api";
import Navbar from "../components/Navbar";

const statusColors = {
  Pending: "bg-amber-400",
  Resolved: "bg-green-400",
  Rejected: "bg-red-400",
  "In Review": "bg-blue-300",
};

// ── Grievance Detail Modal (worker view) ────────────────────────────
const GrievanceDetailModal = ({ grievance, onClose, onWithdraw }) => {
  if (!grievance) return null;
  const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "");
  const [withdrawing, setWithdrawing] = useState(false);

  const handleWithdrawClick = async () => {
    if (!window.confirm("Withdraw this grievance? This cannot be undone.")) return;
    setWithdrawing(true);
    try {
      await grievanceAPI.withdraw(grievance._id);
      toast.success("Grievance withdrawn.");
      onWithdraw(grievance._id);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to withdraw.");
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b-4 border-black px-6 py-4 bg-white flex items-start justify-between gap-4 sticky top-0 z-10">
          <div>
            <h2 className="font-black text-2xl uppercase leading-tight">
              {grievance.title}
            </h2>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span
                className={`${statusColors[grievance.status] || "bg-zinc-300"} border-2 border-black px-3 py-0.5 font-black uppercase text-xs`}
              >
                {grievance.status}
              </span>
              <span className="font-bold text-xs uppercase text-zinc-500 border-2 border-black px-3 py-0.5 bg-zinc-100">
                {grievance.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="border-4 border-black w-10 h-10 flex items-center justify-center font-black text-lg hover:bg-red-400 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shrink-0 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Date */}
          <div className="flex items-center gap-3 border-4 border-black bg-zinc-100 px-5 py-3">
            <p className="font-bold text-xs uppercase text-zinc-500">Filed on</p>
            <p className="font-black text-sm ml-auto">
              {new Date(grievance.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Photo Evidence */}
          {grievance.image ? (
            <div className="flex flex-col gap-2">
              <p className="font-black uppercase text-sm">Photo Evidence</p>
              <div className="border-4 border-black overflow-hidden">
                <img
                  src={`${API_BASE}${grievance.image}`}
                  alt="Evidence"
                  className="w-full max-h-72 object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="border-4 border-dashed border-zinc-300 px-6 py-8 text-center">
              <p className="font-bold uppercase text-sm text-zinc-400">
                No photo evidence uploaded
              </p>
            </div>
          )}

          {/* Description */}
          <div className="flex flex-col gap-2">
            <p className="font-black uppercase text-sm">Description</p>
            <div className="border-4 border-black bg-zinc-50 px-5 py-4">
              <p className="font-medium text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {grievance.description}
              </p>
            </div>
          </div>

          {/* Admin Remark */}
          {grievance.remark && (
            <div className="flex flex-col gap-2">
              <p className="font-black uppercase text-sm">Admin Remark</p>
              <div className="border-4 border-black bg-amber-100 px-5 py-4">
                <p className="font-medium text-zinc-800 leading-relaxed whitespace-pre-wrap">
                  {grievance.remark}
                </p>
              </div>
            </div>
          )}


          {/* Withdraw — only for Pending */}
          {grievance.status === "Pending" && (
            <button
              onClick={handleWithdrawClick}
              disabled={withdrawing}
              className="w-full border-4 border-black bg-red-400 hover:bg-red-500 py-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {withdrawing ? "Withdrawing..." : "⚠ Withdraw Grievance"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGrievance, setSelectedGrievance] = useState(null);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const res = await grievanceAPI.getMyGrievances();
        setGrievances(res.data.grievances);
      } catch (err) {
        setError("Failed to load grievances.");
      } finally {
        setLoading(false);
      }
    };
    fetchGrievances();
  }, []);

  const total = grievances.length;
  const pending = grievances.filter((g) => g.status === "Pending").length;
  const resolved = grievances.filter((g) => g.status === "Resolved").length;
  const inReview = grievances.filter((g) => g.status === "In Review").length;
  const rejected = grievances.filter((g) => g.status === "Rejected").length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleWithdraw = (id) => {
    setGrievances((prev) => prev.filter((g) => g._id !== id));
  };

  const stats = [
    { label: "Total", value: total, bg: "bg-white" },
    { label: "Pending", value: pending, bg: "bg-amber-400" },
    { label: "In Review", value: inReview, bg: "bg-blue-300" },
    { label: "Resolved", value: resolved, bg: "bg-green-400" },
    { label: "Rejected", value: rejected, bg: "bg-red-400" },
  ];

  return (
    <div className="min-h-screen bg-zinc-200">
      {/* Detail Modal */}
      {selectedGrievance && (
        <GrievanceDetailModal
          grievance={selectedGrievance}
          onClose={() => setSelectedGrievance(null)}
          onWithdraw={handleWithdraw}
        />
      )}

      {/* Navbar */}
      <Navbar
        variant="worker"
        userName={user.name || user.email}
        onLogout={handleLogout}
      />

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase">Dashboard</h1>
            <p className="font-medium text-zinc-600 mt-1 uppercase text-sm">
              Welcome back, {user.name || "Union Leader"}
            </p>
          </div>
          <button
            onClick={() => navigate("/grievance/new")}
            className="bg-amber-500 hover:bg-amber-400 border-4 border-black px-6 py-3 font-black cursor-pointer uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all self-start sm:self-auto"
          >
            + Lodge Grievance
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`${s.bg} border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
            >
              <p className="font-bold uppercase text-xs text-zinc-700 mb-2">
                {s.label}
              </p>
              <p className="text-5xl font-black">{loading ? "—" : s.value}</p>
            </div>
          ))}
        </div>

        {/* Grievances Table */}
        <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-black px-6 py-4 flex items-center justify-between">
            <h2 className="font-black text-2xl uppercase">My Grievances</h2>
            <span className="font-bold text-xs uppercase text-zinc-500 hidden sm:block">
              Click a row to view details
            </span>
          </div>

          {error && (
            <div className="border-b-4 border-black bg-red-400 px-6 py-3 font-bold uppercase text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="px-6 py-16 text-center font-black uppercase text-zinc-400 text-xl">
              Loading...
            </div>
          ) : grievances.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-black uppercase text-zinc-400 text-xl mb-4">
                No grievances filed yet.
              </p>
              <button
                onClick={() => navigate("/grievance/new")}
                className="bg-amber-500 border-4 border-black px-6 py-3 font-black uppercase hover:bg-amber-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 cursor-pointer active:shadow-none transition-all"
              >
                File Your First Grievance
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-4 border-black bg-zinc-100">
                    <th className="px-6 py-4 text-left font-black uppercase text-sm border-r-4 border-black w-16">
                      S.No
                    </th>
                    <th className="px-6 py-4 text-left font-black uppercase text-sm border-r-4 border-black">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left font-black uppercase text-sm border-r-4 border-black">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left font-black uppercase text-sm border-r-4 border-black">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left font-black uppercase text-sm border-r-4 border-black w-36">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left font-black uppercase text-sm w-36">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {grievances.map((g, i) => (
                    <tr
                      key={g._id}
                      onClick={() => setSelectedGrievance(g)}
                      className="border-b-2 border-zinc-300 hover:bg-amber-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 text-center py-4 font-black text-zinc-500 border-r-4 border-black">
                        {i + 1}
                      </td>
                      <td className="px-6 py-4 font-black text-sm border-r-4 border-black max-w-xs">
                        <span className="line-clamp-1">{g.title}</span>
                      </td>
                      <td className="px-6 py-4 border-r-4 border-black">
                        <span className="bg-zinc-200 border-2 border-black px-2 py-0.5 font-bold uppercase text-xs whitespace-nowrap">
                          {g.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium border-r-4 border-black max-w-xs">
                        <span className="line-clamp-2 text-sm">{g.description}</span>
                      </td>
                      <td className="px-6 text-center py-4 font-bold text-sm border-r-4 border-black text-zinc-600">
                        {new Date(g.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`${statusColors[g.status] || "bg-zinc-300"} border-2 border-black px-3 py-1 font-black uppercase text-xs`}
                        >
                          {g.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;