import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const RecentNotesPreview = () => {
  const { user, loading: authLoading } = useContext(AuthContext);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //  DO NOT CALL API IF NOT LOGGED IN
    if (!user) {
      setLoading(false);
      setNotes([]);
      return;
    }

    API.get("/notes")
      .then((res) => {
        setNotes(res.data.slice(0, 3));
      })
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, [user]);

  // ⏳ wait for auth check
  if (authLoading) return null;

  return (
    <section className="space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Recent Notes</h2>

        {user && (
          <Link
            to="/documents"
            className="text-sm text-[var(--color-muted)] hover:underline"
          >
            View all
          </Link>
        )}
      </div>

      {!user ? (
        <p className="text-[var(--color-muted)]">
          Login to see your recent notes
        </p>
      ) : loading ? (
        <p className="text-[var(--color-muted)]">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-[var(--color-muted)]">
          No notes yet. Create your first note ✨
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Link
              key={note._id}
              to={`/view-pdf?url=${encodeURIComponent(note.pdfUrl)}`}
              className="
                bg-[var(--color-surface)]
                border border-[var(--color-border)]
                rounded-xl p-5
                hover:shadow-lg transition
              "
            >
              <h3 className="font-medium truncate">
                {note.title}.pdf
              </h3>

              <p className="text-xs text-[var(--color-muted)] mt-2">
                {new Date(note.createdAt).toDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentNotesPreview;
