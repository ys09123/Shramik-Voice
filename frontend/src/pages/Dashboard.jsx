import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { grievanceAPI } from "../services/api";

const statusColors = {
  Pending: "bg-amber-400",
  Closed: "bg-green-400",
  Rejected: "bg-red-400",
  "In Review": "bg-blue-300",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  const closed = grievances.filter((g) => g.status === "Closed").length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const stats = [
    { label: "Total Grievances", value: total, bg: "bg-white" },
    { label: "Pending", value: pending, bg: "bg-amber-400" },
    { label: "Closed", value: closed, bg: "bg-green-400" },
  ];

  return (
    <div className="min-h-screen bg-zinc-200">
      {/* Navbar */}
      <nav className="border-b-4 border-black bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 border-4 border-black flex items-center justify-center font-black text-lg">
            SV
          </div>
          <span className="font-black text-xl uppercase tracking-tight">
            Shramik Voice
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-bold uppercase text-sm text-zinc-600 hidden sm:block">
            <span className="font-bold text-black ">Welcome</span> {user.name || user.email || "Worker"}!
          </span>
          <button
            onClick={handleLogout}
            className="border-4 border-black px-4 py-2 font-bold uppercase text-sm hover:bg-red-400 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`${s.bg} border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
            >
              <p className="font-bold uppercase text-sm text-zinc-700 mb-2">
                {s.label}
              </p>
              <p className="text-6xl font-black">{loading ? "—" : s.value}</p>
            </div>
          ))}
        </div>

        {/* Grievances Table */}
        <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-4 border-black px-6 py-4">
            <h2 className="font-black text-2xl uppercase">My Grievances</h2>
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
                      className="border-b-2 border-zinc-300 hover:bg-zinc-50 transition-colors"
                    >
                      <td className="px-6 text-center py-4 font-black text-zinc-500 border-r-4 border-black">
                        {i + 1}
                      </td>
                      <td className="px-6 py-4 font-medium border-r-4 border-black max-w-xs">
                        <span className="line-clamp-2">{g.description}</span>
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