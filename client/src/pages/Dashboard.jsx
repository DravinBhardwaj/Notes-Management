import heroVideo from "../assets/hero.mp4";
import { Link } from "react-router-dom";
import { useContext } from "react";

import FeaturesSection from "../components/FeaturesSection";
import RecentNotesPreview from "../components/RecentNotesPreview";
import DashboardStats from "../components/DashboardStats";
import SuperAdminDashboardStats from "../components/SuperAdminDashboardStats";
import logo from "../assets/Acadexia.png";

import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="space-y-24 md:space-y-28">
      {/* HERO SECTION */}
      <section className="min-h-[85vh] grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* LEFT */}
        <div className="space-y-6 md:pl-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Organize your
            <span className="text-[var(--color-primary)]"> study notes</span>
            <br />
            for focused exam preparation
          </h1>

          <p className="max-w-md text-lg text-[var(--color-muted)]">
            A structured academic workspace to write, manage, and revise
            your notes efficiently — designed for serious study and
            exam-ready revision.
          </p>

          <div className="flex gap-4 pt-4">
            <Link to="/create">
              <button className="bg-[var(--color-primary)] text-black px-6 py-3 rounded-lg font-medium">
                Create a Note
              </button>
            </Link>

            <Link to="/documents">
              <button className="border px-6 py-3 rounded-lg">
                Browse Notes
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative flex justify-center">
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-w-md rounded-xl"
          />
        </div>
      </section>

      {/*  STATS (ROLE-BASED) */}
      {user?.role === "superadmin" ? (
        <SuperAdminDashboardStats />
      ) : (
        <DashboardStats />
      )}

      {/* FEATURES */}
      <FeaturesSection />

      {/* RECENT NOTES */}
      <RecentNotesPreview />

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto bg-[var(--color-surface)] border rounded-2xl px-8 py-12">
          <h2 className="text-3xl font-bold">
            Study with clarity and confidence
          </h2>

          <p className="text-[var(--color-muted)] mt-4">
            Keep your notes private when drafting, publish them when ready,
            and always have clean, downloadable PDFs for revision.
          </p>

          <Link to="/create">
            <button className="mt-6 bg-[var(--color-primary)] text-black px-8 py-3 rounded-xl">
              Start Writing Notes
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
