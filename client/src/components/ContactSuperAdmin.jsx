import { useState, useContext } from "react";
import emailjs from "@emailjs/browser";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";

const ContactSuperAdmin = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(""); // success | limit | error

  // ✅ Explicit role mapping (IMPORTANT)
  const getUserRoleLabel = () => {
    if (user.role === "superadmin") return "Super Admin";
    if (user.isGroupAdmin) return "Group Admin";
    return "Student";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setStatus("error");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      // 🔒 Backend rate-limit check (1 request/day)
      await API.post("/users/contact-super-admin");

      // 📩 Send email via EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: user.name,
          email: user.email,
          role: getUserRoleLabel(), // ✅ FIXED
          message: message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      setMessage("");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 429) {
        setStatus("limit");
      } else {
        setStatus("error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-1">
        Contact Super Admin
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        One request allowed per day
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={user.name}
          disabled
          className="w-full px-3 py-2 rounded bg-black/20 text-sm text-gray-300"
        />

        <input
          type="email"
          value={user.email}
          disabled
          className="w-full px-3 py-2 rounded bg-black/20 text-sm text-gray-300"
        />

        <textarea
  placeholder="Write your request…"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && message.trim()) {
        handleSubmit(e);
      }
    }
  }}
  className="w-full px-3 py-2 rounded bg-black/20 text-sm resize-none text-white"
  rows={4}
/>


        <button
          type="submit"
          disabled={loading || !message.trim()}
          className={`w-full px-4 py-2 rounded font-medium transition ${
            loading || !message.trim()
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[var(--color-primary)] text-black hover:opacity-90"
          }`}
        >
          {loading ? "Sending..." : "Send Request"}
        </button>

        {/* STATUS MESSAGE */}
        {status && (
          <div className="flex items-center justify-between mt-3 px-3 py-2 rounded bg-black/30 text-sm">
            <span>
              {status === "success" && "✅ Request sent successfully!"}
              {status === "limit" && "⚠️ You can send only one request per day."}
              {status === "error" && "❌ Failed to send request. Try again."}
            </span>

            <button
              type="button"
              onClick={() => setStatus("")}
              className="text-red-400 hover:text-red-500 font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactSuperAdmin;
