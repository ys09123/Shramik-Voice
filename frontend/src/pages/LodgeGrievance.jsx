import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { grievanceAPI } from "../services/api";
import toast from "react-hot-toast";

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

const LodgeGrievance = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG, PNG and WEBP allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) {
      toast.error("All fields are required.");
      return;
    }
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    if (image) formData.append("image", image);

    setLoading(true);
    try {
      await grievanceAPI.create(formData);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-custom-enter" : "animate-custom-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="shrink-0 pt-0.5">
                {preview ? (
                  <img
                    src={preview}
                    alt="evidence"
                    className="w-20 h-full object-cover border-r-4 border-black shrink-0"
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                    alt="evidence"
                    className="w-20 h-full object-cover border-r-4 border-black shrink-0"
                  />
                )}
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
          className="border-4 border-black px-4 py-2 font-bold uppercase text-sm hover:bg-zinc-100 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 cursor-pointer active:translate-y-1 active:shadow-none"
        >
          ← Back
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="border-4 border-black bg-zinc-300 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          {/* Header */}
          <div className="border-b-4 border-black p-6 bg-white">
            <h1 className="font-black text-4xl uppercase">Lodge Grievance</h1>
            <p className="font-medium text-zinc-500 uppercase text-sm mt-1">
              Your complaint will be submitted officially
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* ── Two column grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LEFT column */}
              <div className="space-y-6">
                {/* Title */}
                <div className="flex flex-col gap-2">
                  <label className="font-black text-lg uppercase">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full h-14 border-4 border-black bg-white px-4 text-lg outline-none focus:bg-amber-200 transition-colors placeholder:text-zinc-400"
                    placeholder="BRIEF TITLE"
                    required
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label className="font-black text-lg uppercase">
                    Category
                  </label>
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
                    rows={7}
                    className="w-full border-4 border-black bg-white px-4 py-3 text-lg outline-none focus:bg-amber-200 transition-colors resize-none placeholder:text-zinc-400"
                    placeholder="DESCRIBE YOUR GRIEVANCE IN DETAIL..."
                    required
                  />
                  <p className="text-xs font-bold uppercase text-zinc-500">
                    {form.description.length} characters
                  </p>
                </div>
              </div>

              {/* RIGHT column */}
              <div className="space-y-6 flex flex-col">
                {/* Image Upload */}
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-black text-lg uppercase">
                    Photo Evidence{" "}
                    <span className="text-zinc-500 font-bold text-sm normal-case">
                      (optional)
                    </span>
                  </label>

                  {!preview ? (
                    <label className="flex-1 border-4 border-dashed border-black bg-white hover:bg-amber-50 transition-colors cursor-pointer flex flex-col items-center justify-center py-10 gap-3 min-h-48">
                      <span className="text-5xl">📷</span>
                      <span className="font-black uppercase text-zinc-600 text-center">
                        Click to upload photo
                      </span>
                      <span className="font-medium text-xs uppercase text-zinc-400">
                        JPEG, PNG, WEBP — max 5MB
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative border-4 border-black bg-white flex-1">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-400 border-2 border-black px-3 py-1 font-black uppercase text-xs hover:bg-red-500 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                      >
                        ✕ Remove
                      </button>
                      <div className="border-t-4 border-black px-4 py-2 bg-zinc-100">
                        <p className="font-bold uppercase text-xs text-zinc-600 truncate">
                          {image?.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notice */}
                <div className="border-4 border-black bg-amber-100 px-4 py-3">
                  <p className="font-bold uppercase text-sm text-zinc-700">
                    ⚠ Once submitted, your grievance cannot be edited.
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LodgeGrievance;
