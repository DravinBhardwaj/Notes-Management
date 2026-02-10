import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginVideo from "../assets/loginpage.mp4";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    groupId: "",
    groupMode: "join",
  });
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.email ||
      !form.password ||
      (mode === "signup" &&
        (!form.name || !form.groupId || !form.groupMode))
    ) {
      toast.warning("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";

      const res = await API.post(endpoint, form);

      if (mode === "login") {
        // ✅ IMPORTANT FIX:
        // Set user directly from login response
        setUser(res.data);

        toast.success("Welcome back 👋");
        navigate("/");
      } else {
        toast.success("Account created successfully. Please login.");
        setMode("login");
        setForm({
          name: "",
          email: "",
          password: "",
          groupId: "",
          groupMode: "join",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617]">
      {/* LEFT VIDEO */}
      <div className="hidden lg:flex items-center justify-center px-10">
        <div className="relative w-[520px] h-[560px] rounded-3xl overflow-hidden border border-white/10">
          <video
            src={loginVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      </div>

      {/* AUTH CARD */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-white text-center">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>

          {/* SWITCH */}
          <div className="flex bg-black/30 rounded-xl p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg ${
                mode === "login"
                  ? "bg-[var(--color-primary)] text-black"
                  : "text-gray-400"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-lg ${
                mode === "signup"
                  ? "bg-[var(--color-primary)] text-black"
                  : "text-gray-400"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <input
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  className="auth-input"
                />

                <div className="flex gap-4 text-sm text-gray-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="groupMode"
                      value="join"
                      checked={form.groupMode === "join"}
                      onChange={handleChange}
                    />
                    Join existing group
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="groupMode"
                      value="create"
                      checked={form.groupMode === "create"}
                      onChange={handleChange}
                    />
                    Create new group
                  </label>
                </div>

                <input
                  name="groupId"
                  placeholder={
                    form.groupMode === "create"
                      ? "New Group ID (unique)"
                      : "Existing Group ID"
                  }
                  value={form.groupId}
                  onChange={handleChange}
                  className="auth-input"
                />
              </>
            )}

            <input
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-black font-medium"
            >
              {loading
                ? mode === "login"
                  ? "Logging in..."
                  : "Creating..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </form>

          <Link to="/" className="block text-center text-xs text-gray-500">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
