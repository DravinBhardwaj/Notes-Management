import { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import PostingToggle from "./PostingToggle";
import UserRoleTable from "./UserRoleTable";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [system, setSystem] = useState(null);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ADMIN DATA ================= */
  useEffect(() => {
    //  Guard: only superadmin can load this page
    if (!user || user.role !== "superadmin") {
      setLoading(false);
      return;
    }

    const loadAdminData = async () => {
      try {
        const [sysRes, usersRes, statsRes] = await Promise.all([
          API.get("/admin/system-status"),
          API.get("/admin/users"),
          API.get("/admin/stats"),
        ]);

        setSystem(sysRes.data);
        setUsers(usersRes.data);
        setStats(statsRes.data);
      } catch (err) {
        toast.error("Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [user]);

  /* ================= ACCESS DENIED ================= */
  if (!user) {
    return (
      <p className="text-center text-gray-500">
        Checking permissions…
      </p>
    );
  }

  if (user.role !== "superadmin") {
    return (
      <p className="text-center text-red-400">
        Access denied. Super Admin only.
      </p>
    );
  }

  /* ================= LOADING ================= */
  if (loading || !system || !stats) {
    return (
      <p className="text-center text-gray-500">
        Loading admin dashboard…
      </p>
    );
  }

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Full system control & monitoring
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
  <StatCard title="Total Users" value={stats.totalUsers} color="bg-blue-600" />
  <StatCard title="Admins" value={stats.totalGroupAdmins} color="bg-purple-600" />
  <StatCard title="Students" value={stats.totalStudents} color="bg-indigo-600" />
  <StatCard title="Total Notes" value={stats.totalNotes} color="bg-green-600" />
  <StatCard title="Public Notes" value={stats.publicNotes} color="bg-emerald-600" />
  <StatCard title="Private Notes" value={stats.privateNotes} color="bg-gray-700" />
</div>


      {/* POSTING WINDOW TOGGLE */}
      <PostingToggle
        enabled={system.postingEnabled}
        onToggle={(value) =>
          setSystem((prev) => ({ ...prev, postingEnabled: value }))
        }
      />

      {/* USER MANAGEMENT */}
      <UserRoleTable users={users} setUsers={setUsers} />
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({ title, value, color }) => (
  <div className={`${color} text-white rounded-xl p-5 shadow`}>
    <p className="text-sm opacity-90">{title}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

export default AdminDashboard;
