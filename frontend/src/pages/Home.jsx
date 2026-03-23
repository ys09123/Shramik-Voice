import React from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: "✊",
    title: "Lodge a Grievance",
    desc: "Raise your workplace concerns directly and get them on record officially.",
  },
  {
    icon: "📋",
    title: "Track Status",
    desc: "Follow your grievance from submission to resolution in real time.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    desc: "Your identity and complaints are protected. Speak without fear.",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-200 font-sans">
      {/* Navbar */}
      <nav className="border-b-4 sticky top-0 z-1000 border-black bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 border-4 border-black flex items-center justify-center font-black text-lg">
            SV
          </div>
          <span
            className="font-black cursor-pointer text-xl uppercase tracking-tight"
            onClick={() => navigate("/")}
          >
            Shramik Voice
          </span>
        </div>
        <div className="flex items-center gap-3">
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
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 flex flex-col items-center text-center border-b-4 border-black bg-white relative overflow-hidden">
        {/* Background stripes */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)",
            backgroundSize: "12px 12px",
          }}
        />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block border-4 border-black bg-amber-500 px-4 py-1 font-black uppercase text-sm mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Workers' Grievance Platform
          </div>
          <h1 className="text-6xl font-black uppercase leading-none tracking-tight mb-6">
            Your Voice.
            <br />
            <span className="bg-amber-500 px-2">Your Rights.</span>
          </h1>
          <p className="text-lg font-medium text-zinc-600 mb-10 max-w-lg mx-auto">
            A platform built for factory workers and unions to raise, track, and
            resolve workplace grievances — officially and securely.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/register")}
              className="bg-amber-500 hover:bg-amber-400 border-4 border-black px-8 py-4 text-lg font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-white hover:bg-zinc-100 border-4 border-black px-8 py-4 text-lg font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <div
        className="min-h-screen"
        style={{
          backgroundImage: "url('/bg2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="min-h-screen bg-black/40">
          <section className="px-6 py-16 max-w-5xl mx-auto">
            <h2 className="text-3xl text-white uppercase mb-10 border-b-4 border-white pb-4">
              Why Shramik Voice?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_10px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="font-black text-xl uppercase mb-2">
                    {f.title}
                  </h3>
                  <p className="text-zinc-600 font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Banner */}
          <section className="mx-6 mb-16 border-4 border-black bg-amber-500 p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-5xl md:mx-auto my-18 flex flex-col md:flex-row items-center justify-between gap-10 ">
            <div>
              <h2 className="text-3xl font-black uppercase">
                Ready to raise your voice?
              </h2>
              <p className="font-medium text-zinc-800 mt-1">
                Register your union account and file your first grievance today.
              </p>
            </div>
            <button
              onClick={() => navigate("/register")}
              className="bg-black text-white border-4 border-black px-8 py-4 font-black uppercase text-lg whitespace-nowrap hover:bg-zinc-800 cursor-pointer shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              Register Now
            </button>
          </section>
        </div>
      </div>
      {/* Footer */}
      <footer className="border-t-4 border-black bg-white px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-500 border-2 border-black flex items-center justify-center font-black text-xs">
            SV
          </div>
          <span className="font-black uppercase text-sm">Shramik Voice</span>
        </div>
        <p className="text-sm font-medium text-zinc-500 uppercase">
          Built for workers. Powered by unity.
        </p>
      </footer>
    </div>
  );
};

export default Home;
