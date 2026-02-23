import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/Acadexia.png";

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (loading) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setOpen(false);
  };

  /* ================= USER LABEL ================= */
  const renderUserLabel = () => {
    if (!user) return null;

    //  SUPER ADMIN
    if (user.role === "superadmin") {
      return (
        <span className="font-semibold text-purple-400 flex items-center gap-1">
          Hi, {user.name} 👑
        </span>
      );
    }

    //  GROUP ADMIN
    if (user.isGroupAdmin) {
      return (
        <span className="font-medium text-green-400 flex items-center gap-1">
          Hi, {user.name} ⭐
        </span>
      );
    }

    // 🎓 STUDENT
    return (
      <span className="font-medium text-blue-400">
        Hi, {user.name}
      </span>
    );
  };

  /* ================= NAV LINK ================= */
  const navLink = (to, label, onClick) => (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-2 py-1 transition-colors ${
        location.pathname === to
          ? "text-[var(--color-primary)]"
          : "text-gray-300 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
<Link
  to="/"
  className="flex items-center gap-8 sm:gap-8 text-xl sm:text-2xl font-bold text-white"
>
  <div className="flex items-center">
    <img
      src={logo}
      alt="Acadexia"
      className="
        h-12 sm:h-10
        sm:scale-[2]
        origin-left
        object-contain
      "
    />
  </div>

  {/* Hide text on screens < 640px (covers 415px) */}
  <span className="hidden sm:inline">Acadexia</span>
</Link>






        {/* ================= NOT LOGGED IN ================= */}
        {!user && (
          <nav className="flex items-center gap-6 text-sm">
            {navLink("/", "Dashboard")}
            <Link
              to="/login"
              className="bg-red-500 text-white px-4 py-1.5 rounded-md font-medium"
            >
              Login
            </Link>
          </nav>
        )}

        {/* ================= LOGGED IN ================= */}
        {user && (
          <>
            {/* MOBILE TOGGLE */}
            <button
              className="md:hidden text-gray-300 text-xl"
              onClick={() => setOpen(!open)}
            >
              ☰
            </button>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-8 text-sm">
              {navLink("/", "Dashboard")}
              {navLink("/create", "Plan Study")}
              {navLink("/documents", "Documents")}

              {/*  SUPER ADMIN */}
              {user.role === "superadmin" &&
                navLink("/super-admin", "Admin Panel")}

              {/*  ALL GROUP MEMBERS (ADMIN + STUDENT) */}
              {user.groupId &&
                navLink("/group", "Group Dashboard")}

              <div className="px-3 py-1 rounded-full bg-white/5">
                {renderUserLabel()}
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1.5 rounded-md font-medium"
              >
                Logout
              </button>
            </nav>
          </>
        )}
      </div>

      {/* ================= MOBILE MENU ================= */}
      {user && open && (
        <div className="md:hidden border-t border-white/10 bg-[var(--color-surface)] px-6 py-4 space-y-3 text-sm">
          {navLink("/", "Dashboard", () => setOpen(false))}
          {navLink("/create", "Plan Study", () => setOpen(false))}
          {navLink("/documents", "Documents", () => setOpen(false))}

          {user.role === "superadmin" &&
            navLink("/super-admin", "Admin Panel", () => setOpen(false))}

          {/*  ALL GROUP MEMBERS */}
          {user.groupId &&
            navLink("/group", "Group Dashboard", () => setOpen(false))}

          <div className="pt-2 border-t border-white/10">
            {renderUserLabel()}
          </div>

          <button
  onClick={handleLogout}
  className="
    bg-red-500 text-white
    px-3 py-1
    text-xs font-medium
    rounded-md
    hover:bg-red-600
    transition
  "
>
  Logout
</button>

        </div>
      )}
    </header>
  );
};

export default Navbar;
