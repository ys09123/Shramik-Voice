import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { grievanceAPI } from "../services/api";

const categories = [
  "Wages & Salary",
  "Working Hours",
  "Safety & Health",
  "Harassment",
  "Wrongful Termination",
  "Leave & Holidays",
  "Discrimination",
  "Other",
];
const user = JSON.parse(localStorage.getItem("user") || "{}");
// console.log(user.name);

const LodgeGrievance = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.category) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await grievanceAPI.createGrievance(form);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-custom-enter" : "animate-custom-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                  alt=""
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {`Hey ${user.name || "User"}, grievance submitted!`}
                </p>
                <p className="mt-1 text-sm text-gray-500">{form.title}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center cursor-pointer justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ));
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to submit. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

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
        <button
          onClick={() => navigate("/dashboard")}
          className="border-4 border-black px-4 py-2 font-bold uppercase text-sm hover:bg-zinc-100 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          ← Back
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Success State */}
        {success ? (
          <div className="max-w-6xl mx-auto w-full border-4 border-black bg-zinc-300 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b-4 border-black p-6 bg-green-400">
              <h1 className="font-black text-4xl uppercase">
                Grievance Filed!
              </h1>
            </div>
            <div className="p-8 space-y-6">
              <p className="font-bold text-lg uppercase text-zinc-700">
                Your grievance has been successfully submitted. You can track
                its status from your dashboard.
              </p>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-amber-500 hover:bg-amber-400 border-4 border-black px-6 py-3 font-black uppercase cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setForm({ title: "", description: "", category: "" });
                  }}
                  className="bg-white hover:bg-zinc-100 border-4 border-black px-6 py-3 font-black cursor-pointer uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  File Another
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-4 border-black bg-zinc-300 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            {/* Header */}
            <div className="border-b-4 border-black p-6 bg-white">
              <h1 className="font-black text-4xl uppercase">Lodge Grievance</h1>
              <p className="font-medium text-zinc-500 uppercase text-sm mt-1">
                Your complaint will be submitted officially
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 overflow-y-auto flex-1"
            >
              {error && (
                <div className="border-4 border-black bg-red-400 px-4 py-3 font-bold uppercase text-sm">
                  {error}
                </div>
              )}

              {/* Title */}
              <div className="flex flex-col gap-2">
                <label className="font-black text-lg uppercase">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full h-14 border-4 border-black bg-white px-4 text-lg outline-none focus:bg-amber-200 transition-colors placeholder:text-zinc-400"
                  placeholder="BRIEF TITLE OF YOUR GRIEVANCE"
                  required
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <label className="font-black text-lg uppercase">Category</label>
                <div className="relative">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full h-14 border-4 border-black bg-white px-4 text-lg outline-none focus:bg-amber-200 transition-colors appearance-none cursor-pointer font-bold uppercase"
                    required
                  >
                    <option value="" disabled>
                      SELECT A CATEGORY
                    </option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none font-black text-xl">
                    ▼
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="font-black text-lg uppercase">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full border-4 border-black bg-white px-4 py-3 text-lg outline-none focus:bg-amber-200 transition-colors resize-none placeholder:text-zinc-400"
                  placeholder="DESCRIBE YOUR GRIEVANCE IN DETAIL..."
                  required
                />
                <p className="text-xs font-bold uppercase text-zinc-500">
                  {form.description.length} characters — be as specific as
                  possible
                </p>
              </div>

              {/* Notice */}
              <div className="border-4 border-black bg-amber-100 px-4 py-3">
                <p className="font-bold uppercase text-sm text-zinc-700">
                  ⚠ Once submitted, your grievance cannot be edited. Make sure
                  all details are accurate.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 border-4 border-black py-4 text-xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Submitting..." : "Submit Grievance"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LodgeGrievance;
