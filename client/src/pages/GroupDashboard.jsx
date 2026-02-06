import { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const GroupDashboard = () => {
  const { user } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD MEMBERS ================= */
  useEffect(() => {
    if (!user?.groupId) {
      setLoading(false);
      return;
    }

    API.get("/group/members")
      .then((res) => setMembers(res.data))
      .catch(() => toast.error("Failed to load group members"))
      .finally(() => setLoading(false));
  }, [user]);

  /* ================= TOGGLE ADMIN ================= */
  const toggleAdmin = async (id) => {
    try {
      const res = await API.put(
        `/group/members/${id}/toggle-admin`
      );

      setMembers((prev) =>
        prev.map((u) => (u._id === id ? res.data : u))
      );

      toast.success("Role updated successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Action not allowed"
      );
    }
  };

  /* ================= STATES ================= */
  if (!user?.groupId) {
    return (
      <p className="text-center text-gray-400">
        You are not part of any group
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-center text-gray-400">
        Loading group dashboard…
      </p>
    );
  }

  if (members.length === 0) {
    return (
      <p className="text-center text-gray-400">
        No members found in this group
      </p>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Group Dashboard
        </h1>
        <p className="text-sm text-gray-400">
          Group ID:{" "}
          <span className="text-white">{user.groupId}</span>
        </p>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        {members.map((m) => (
          <div
            key={m._id}
            className="flex justify-between items-center px-4 py-3 border-b border-white/5"
          >
            {/* USER INFO */}
            <div>
              <p className="text-white font-medium">
                {m.name}
              </p>
              <p className="text-xs text-gray-400">
                {m.email}
              </p>
            </div>

            {/* ROLE + ACTION */}
            <div className="flex items-center gap-4">
              <span className="text-sm">
                {m.isGroupAdmin ? "⭐ Admin" : "🎓 Student"}
              </span>

              {/*  ONLY GROUP ADMIN CAN SEE BUTTON */}
              {user.isGroupAdmin && user._id !== m._id && (
                <button
                  onClick={() => toggleAdmin(m._id)}
                  className={`text-xs px-3 py-1 rounded text-white ${
                    m.isGroupAdmin
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {m.isGroupAdmin
                    ? "Remove Admin"
                    : "Make Admin"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupDashboard;
