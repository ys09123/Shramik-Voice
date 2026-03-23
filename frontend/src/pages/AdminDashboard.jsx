import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../services/api";

const statusColors = {
  Pending: "bg-amber-400",
  Closed: "bg-green-400",
  Rejected: "bg-red-400",
  "In Review": "bg-blue-300",
};

const tabs = ["Overview", "Grievances", "Users"];

const StatusDropdown = ({ grievance, onUpdate }) => {
  const [updating, setUpdating] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      await adminAPI.updateStatus(grievance._id, newStatus);
      onUpdate(grievance._id, newStatus);
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <select
      value={grievance.status}
      onChange={handleChange}
      disabled={updating}
      className={`${statusColors[grievance.status] || "bg-zinc-300"} border-2 border-black px-3 py-1 font-black uppercase text-xs cursor-pointer outline-none disabled:opacity-50 disabled:cursor-wait`}
    >
      <option value="Pending">Pending</option>
      <option value="In Review">In Review</option>
      <option value="Closed">Closed</option>
      <option value="Rejected">Rejected</option>
    </select>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, usersRes, grievancesRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getAllUsers(),
          adminAPI.getAllGrievances(),
        ]);
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users);
        setGrievances(grievancesRes.data.grievances);
      } catch (err) {
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Updates grievance status in local state instantly — no refetch needed
  const handleStatusUpdate = (id, newStatus) => {
    setGrievances((prev) =>
      prev.map((g) => (g._id === id ? { ...g, status: newStatus } : g)),
    );
    setStats((prev) => ({
      ...prev,
      recentGrievances: prev?.recentGrievances?.map((g) =>
        g._id === id ? { ...g, status: newStatus } : g,
      ),
    }));
    toast.success("Status updated!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const pendingCount = grievances.filter((g) => g.status === "Pending").length;
  const closedCount = grievances.filter((g) => g.status === "Closed").length;

  return (
    <div className="min-h-screen bg-zinc-200">
      {/* Navbar */}
      <nav className="border-b-4 border-black bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black border-4 border-black flex items-center justify-center font-black text-lg text-amber-400">
            SV
          </div>
          <div>
            <span className="font-black text-xl uppercase tracking-tight">
              Shramik Voice
            </span>
            <span className="ml-3 bg-amber-500 border-2 border-black px-2 py-0.5 text-xs font-black uppercase">
              Admin
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="border-4 border-black px-4 py-2 font-bold uppercase text-sm hover:bg-red-400 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black uppercase">Admin Dashboard</h1>
          <p className="font-medium text-zinc-500 uppercase text-sm mt-1">
            Full platform overview
          </p>
        </div>

        {error && (
          <div className="border-4 border-black bg-red-400 px-6 py-4 font-bold uppercase text-sm">
            {error}
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: stats?.totalUsers, bg: "bg-white" },
            {
              label: "Total Grievances",
              value: stats?.totalGrievances,
              bg: "bg-amber-400",
            },
            { label: "Pending", value: pendingCount, bg: "bg-red-500" },
            { label: "Closed", value: closedCount, bg: "bg-green-400" },
          ].map((s, i) => (
            <div
              key={i}
              className={`${s.bg} border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
            >
              <p className="font-bold uppercase text-xs text-zinc-600 mb-2">
                {s.label}
              </p>
              <p className="text-5xl font-black">
                {loading ? "—" : (s.value ?? 0)}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-4 border-black w-fit shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-black uppercase text-sm border-r-4 border-black last:border-r-0 transition-colors
                ${activeTab === tab ? "bg-amber-500" : "bg-white hover:bg-zinc-100"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "Overview" && (
          <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-4 border-black px-6 py-4 flex items-center justify-between">
              <h2 className="font-black text-2xl uppercase">
                Recent Grievances
              </h2>
              <span className="font-bold text-sm uppercase text-zinc-500">
                Last 5
              </span>
            </div>
            {loading ? (
              <div className="px-6 py-16 text-center font-black uppercase text-zinc-400 text-xl">
                Loading...
              </div>
            ) : stats?.recentGrievances?.length === 0 ? (
              <div className="px-6 py-16 text-center font-black uppercase text-zinc-400 text-xl">
                No grievances yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-4 border-black bg-zinc-100">
                      <th className="px-6 py-4 text-left font-black uppercase text-sm border-r-4 border-black">
                        Name & Email
                      </th>
                      <th className="px-6 py-4 text-left font-black uppercase text-sm border-r-4 border-black">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left font-black uppercase text-sm border-r-4 border-black">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left font-black uppercase text-sm">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentGrievances?.map((g) => (
                      <tr
                        key={g._id}
                        className="border-b-2 border-zinc-200 hover:bg-zinc-50 transition-colors"
                      >
                        <td className="px-6 py-4 border-r-4 border-black">
                          <p className="font-black text-sm">
                            {g.user?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-zinc-500 font-medium">
                            {g.user?.email}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-medium border-r-4 border-black max-w-xs">
                          <span className="line-clamp-2 text-sm">
                            {g.description}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-sm border-r-4 border-black text-zinc-600">
                          {new Date(g.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <StatusDropdown
                            grievance={g}
                            onUpdate={handleStatusUpdate}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── GRIEVANCES TAB ── */}
        {activeTab === "Grievances" && (
          <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-4 border-black px-6 py-4 flex items-center justify-between">
              <h2 className="font-black text-2xl uppercase">All Grievances</h2>
              <span className="font-bold text-sm uppercase text-zinc-500">
                {grievances.length} total
              </span>
            </div>
            {loading ? (
              <div className="px-6 py-16 text-center font-black uppercase text-zinc-400 text-xl">
                Loading...
              </div>
            ) : grievances.length === 0 ? (
              <div className="px-6 py-16 text-center font-black uppercase text-zinc-400 text-xl">
                No grievances filed yet.
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
                        Name & Email
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
                        className="border-b-2 border-zinc-200 hover:bg-zinc-50 transition-colors"
                      >
                        <td className="px-6 text-center py-4 font-black text-zinc-400 border-r-4 border-black">
                          {i + 1}
                        </td>
                        <td className="px-6 py-4 border-r-4 border-black">
                          <p className="font-black text-sm">
                            {g.user?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-zinc-500 font-medium">
                            {g.user?.email}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-medium border-r-4 border-black max-w-xs">
                          <span className="line-clamp-2 text-sm">
                            {g.description}
                          </span>
                        </td>
                        <td className="px-6 text-center py-4 font-bold text-sm border-r-4 border-black text-zinc-600">
                          {new Date(g.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <StatusDropdown
                            grievance={g}
                            onUpdate={handleStatusUpdate}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === "Users" && (
          <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-4 border-black px-6 py-4 flex items-center justify-between">
              <h2 className="font-black text-2xl uppercase">All Users</h2>
              <span className="font-bold text-sm uppercase text-zinc-500">
                {users.length} registered
              </span>
            </div>
            {loading ? (
              <div className="px-6 py-16 text-center font-black uppercase text-zinc-400 text-xl">
                Loading...
              </div>
            ) : users.length === 0 ? (
              <div className="px-6 py-16 text-center font-black uppercase text-zinc-400 text-xl">
                No users registered yet.
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
                        Name
                      </th>
                      <th className="px-6 py-4 text-left font-black uppercase text-sm border-r-4 border-black">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left font-black uppercase text-sm border-r-4 border-black">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left font-black uppercase text-sm">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr
                        key={u._id}
                        className="border-b-2 border-zinc-200 hover:bg-zinc-50 transition-colors"
                      >
                        <td className="px-6 text-center py-4 font-black text-zinc-400 border-r-4 border-black">
                          {i + 1}
                        </td>
                        <td className="px-6 py-4 font-black border-r-4 border-black">
                          {u.name}
                        </td>
                        <td className="px-6 py-4 font-medium text-sm text-zinc-600 border-r-4 border-black">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 border-r-4 border-black">
                          <span
                            className={`${u.role === "admin" ? "bg-black text-amber-400" : "bg-zinc-200"} border-2 border-black px-3 py-1 font-black uppercase text-xs`}
                          >
                            {u.role || "user"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-sm text-zinc-600">
                          {new Date(u.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
