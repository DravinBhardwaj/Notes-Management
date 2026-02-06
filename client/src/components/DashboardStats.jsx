import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const DashboardStats = () => {
  const { user, loading: authLoading } = useContext(AuthContext);

  const [stats, setStats] = useState({
    total: 0,
    lastUpdated: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    API.get("/notes")
      .then((res) => {
        const notes = res.data;
        setStats({
          total: notes.length,
          lastUpdated: notes[0]?.updatedAt || null,
        });
      })
      .catch(() => {
        setStats({ total: 0, lastUpdated: null });
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading) return null;

  if (!user) {
    return (
      <p className="text-[var(--color-muted)]">
        Login to view dashboard statistics
      </p>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div className="bg-[var(--color-surface)] border rounded-xl p-6">
        <p className="text-sm text-[var(--color-muted)]">Total Notes</p>
        <h2 className="text-3xl font-semibold mt-2">
          {loading ? "—" : stats.total}
        </h2>
      </div>

      <div className="bg-[var(--color-surface)] border rounded-xl p-6">
        <p className="text-sm text-[var(--color-muted)]">Last Updated</p>
        <h2 className="text-xl font-semibold mt-2">
          {loading
            ? "—"
            : stats.lastUpdated
            ? new Date(stats.lastUpdated).toDateString()
            : "No activity"}
        </h2>
      </div>

      <div className="bg-[var(--color-surface)] border rounded-xl p-6">
        <p className="text-sm text-[var(--color-muted)]">Quick Action</p>
        <Link to="/create">
          <button className="mt-3 text-[var(--color-primary)] font-medium">
            + New Note
          </button>
        </Link>
      </div>
    </section>
  );
};

export default DashboardStats;
