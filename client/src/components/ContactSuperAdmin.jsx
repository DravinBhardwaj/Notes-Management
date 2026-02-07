import { useState, useContext } from "react";
import emailjs from "@emailjs/browser";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";

const ContactSuperAdmin = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const getUserRoleLabel = () => {
    if (user.role === "superadmin") return "Super Admin";
    if (user.isGroupAdmin) return "Group Admin";
    return "Student";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return setStatus("error");

    setLoading(true);
    setStatus("");

    try {
      await API.post("/users/contact-super-admin");

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: user.name,
          email: user.email,
          role: getUserRoleLabel(),
          message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      setMessage("");
    } catch (err) {
      if (err.response?.status === 429) setStatus("limit");
      else setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">

      <div className="relative bg-[var(--color-surface)]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-7 shadow-lg">
        {/* Header */}
        <h2 className="text-2xl font-semibold text-white mb-1">
          Contact Super Admin
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          You can send only <span className="text-white font-medium">one request per day</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            value={user.name}
            disabled
            className="w-full px-4 py-2.5 rounded-lg bg-black/30 text-sm text-gray-300 border border-white/10"
          />

          {/* Email */}
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-2.5 rounded-lg bg-black/30 text-sm text-gray-300 border border-white/10"
          />

          {/* Message */}
          <div>
            <textarea
              placeholder="Write your request…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!loading && message.trim()) handleSubmit(e);
                }
              }}
              className="w-full px-4 py-3 rounded-lg bg-black/30 text-sm text-white resize-none border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              rows={4}
            />
            <p className="text-xs text-gray-400 mt-1">
              Press <b>Enter</b> to send and <b>Shift + Enter</b> for new line
            </p>
          </div>

          {/* Button */}
          <button
  type="submit"
  disabled={loading || !message.trim()}
  className={`w-full py-2.5 rounded-lg font-semibold transition-all ${
    loading || !message.trim()
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-gradient-to-r from-indigo-300 via-purple-300 to-yellow-300 text-black hover:brightness-105"
  }`}
>
  {loading ? "Sending…" : "Send Request"}
</button>


          {/* Status */}
          {status && (
            <div
              className={`mt-3 px-4 py-2 rounded-lg text-sm flex items-center justify-between ${
                status === "success"
                  ? "bg-green-500/10 text-green-400"
                  : status === "limit"
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              <span>
                {status === "success" && "✅ Request sent successfully"}
                {status === "limit" && "⏳ You’ve already sent a request today"}
                {status === "error" && "❌ Something went wrong. Try again"}
              </span>
              <button
                onClick={() => setStatus("")}
                className="font-bold hover:opacity-70"
              >
                ✕
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactSuperAdmin;
