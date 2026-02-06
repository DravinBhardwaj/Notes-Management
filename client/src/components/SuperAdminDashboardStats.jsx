import { useEffect, useState } from "react";
import API from "../utils/api";

const SuperAdminDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center">Loading stats...</div>;
  }

  if (!stats) {
    return <div className="text-center text-red-400">Failed to load stats</div>;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Total Users" value={stats.totalUsers} />
      <StatCard title="Admins" value={stats.totalGroupAdmins} />
      <StatCard title="Students" value={stats.totalStudents} />
      <StatCard title="Total Notes" value={stats.totalNotes} />
      <StatCard title="Public Notes" value={stats.publicNotes} />
      <StatCard title="Private Notes" value={stats.privateNotes} />
    </section>
  );
};

const StatCard = ({ title, value }) => (
  <div className="rounded-xl p-6 bg-[var(--color-surface)] border">
    <p className="text-sm text-gray-400">{title}</p>
    <h2 className="text-3xl font-bold mt-2">{value}</h2>
  </div>
);

export default SuperAdminDashboardStats;
