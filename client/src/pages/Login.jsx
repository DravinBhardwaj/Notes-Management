import { useState } from "react";
import { Link } from "react-router-dom";
import loginVideo from "../assets/loginpage.mp4";

const Login = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.email || !form.password || (mode === "signup" && !form.name)) {
      alert("Please fill all required fields");
      return;
    }

    alert(`${mode === "login" ? "Logged in" : "Signed up"} (frontend only)`);
  };

  return (
    <div className="min-h-[85vh] grid grid-cols-1 md:grid-cols-2">

      {/* ================= LEFT VIDEO CARD ================= */}
      <div className="hidden md:flex items-center justify-center">

        <div className="
          relative
          w-[480px]
          h-[520px]
          rounded-2xl
          overflow-hidden
          shadow-2xl
          border border-[var(--color-border)]
        ">
          {/* VIDEO */}
          <video
            src={loginVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/40" />

          {/* TEXT */}
          <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
            <h1 className="text-3xl font-bold">
              Notes<span className="text-[var(--color-primary)]">.</span>
            </h1>
            <p className="text-sm text-gray-200 leading-relaxed">
              A calm, distraction-free space to write, refine,
              and generate meaningful documents.
            </p>
          </div>
        </div>

      </div>

      {/* ================= RIGHT AUTH CARD ================= */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 space-y-6">

          {/* TOGGLE */}
          <div className="flex bg-[var(--color-bg)] rounded-lg p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                mode === "login"
                  ? "bg-[var(--color-primary)] text-black"
                  : "text-[var(--color-muted)]"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                mode === "signup"
                  ? "bg-[var(--color-primary)] text-black"
                  : "text-[var(--color-muted)]"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* FORM */}
          <div className="space-y-4">
            {mode === "signup" && (
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                className="auth-input"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="auth-input"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="auth-input"
            />
          </div>

          {/* ACTION */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[var(--color-primary)] text-black py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>

          {/* FOOTER */}
          <p className="text-center text-sm text-[var(--color-muted)]">
            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </p>

          <div className="text-center">
            <Link
              to="/"
              className="text-xs text-[var(--color-muted)] hover:underline"
            >
              ← Back to Dashboard
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
