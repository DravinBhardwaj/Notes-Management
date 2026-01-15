import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      
      {/* subtle yellow top glow */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-70" />

      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2"
        >
          <span className="text-[var(--color-accent)]">●</span>
          Notes
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-6 text-sm">
          <Link
            to="/"
            className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition"
          >
            Dashboard
          </Link>

          <Link
            to="/create"
            className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition"
          >
            New Note
          </Link>

          {/* NEW: Documents (PDF Store) */}
          <Link
            to="/documents"
            className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition"
          >
            Documents
          </Link>

          <Link
            to="/login"
            className="bg-[var(--color-accent)] text-black px-4 py-1.5 rounded-md font-medium hover:opacity-90 transition"
          >
            Login
          </Link>
        </nav>

      </div>
    </header>
  );
};

export default Navbar;
