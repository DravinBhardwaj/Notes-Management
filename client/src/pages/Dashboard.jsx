import heroVideo from "../assets/hero.mp4";

const Dashboard = () => {
  return (
    <div className="space-y-28">

      {/* ================= HERO SECTION ================= */}
      <section className="min-h-[85vh] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-6 md:pl-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Organize your
            <span className="text-[var(--color-primary)]"> notes</span>
            <br />
            without distractions
          </h1>

          <p className="max-w-md text-lg text-[var(--color-muted)]">
            A calm, distraction-free space to capture ideas, manage tasks,
            and revisit your thoughts anytime.
          </p>

          <div className="flex gap-4 pt-4">
            <button className="bg-[var(--color-primary)] text-black px-6 py-3 rounded-lg font-medium hover:opacity-90 transition">
              Create Note
            </button>

            <button className="border border-[var(--color-border)] px-6 py-3 rounded-lg hover:bg-[var(--color-surface)] transition">
              View Notes
            </button>
          </div>
        </div>

        {/* RIGHT VIDEO */}
        <div className="relative flex justify-center ">
          <video 
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-w-md rounded-xl"
          />

          {/* subtle glow */}
          <div className="absolute inset-0 bg-[var(--color-primary)] opacity-20 blur-3xl -z-10" />
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <p className="text-sm text-[var(--color-muted)]">Total Notes</p>
          <h2 className="text-3xl font-semibold mt-2">12</h2>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <p className="text-sm text-[var(--color-muted)]">Last Updated</p>
          <h2 className="text-xl font-semibold mt-2">Today</h2>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <p className="text-sm text-[var(--color-muted)]">Quick Action</p>
          <button className="mt-3 text-[var(--color-primary)] font-medium">
            + New Note
          </button>
        </div>
      </section>

      
    </div>
  );
};

export default Dashboard;
