import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-200 flex flex-col items-center justify-center p-6 text-center">
      {/* Big 404 */}
      <div className="border-4 border-black bg-amber-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-10 mb-8 max-w-lg w-full">
        <p className="font-black text-[10rem] leading-none text-black select-none">
          404
        </p>
        <h1 className="font-black text-3xl uppercase mt-2">Page Not Found</h1>
        <p className="font-medium text-zinc-800 mt-3">
          The page you're looking for doesn't exist, or was moved.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => navigate(-1)}
          className="border-4 border-black bg-white px-8 py-4 font-black uppercase text-lg hover:bg-zinc-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          ← Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="border-4 border-black bg-black text-white px-8 py-4 font-black uppercase text-lg hover:bg-zinc-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          Go Home
        </button>
      </div>

      {/* Branding */}
      <div className="mt-12 flex items-center gap-2 opacity-50">
        <div className="w-7 h-7 bg-amber-500 border-2 border-black flex items-center justify-center font-black text-xs">
          SV
        </div>
        <span className="font-black uppercase text-sm">Shramik Voice</span>
      </div>
    </div>
  );
};

export default NotFound;
