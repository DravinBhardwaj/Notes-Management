const features = [
  {
    title: "Page-based Editor",
    desc: "Write notes page-by-page just like a real document. Each page is PDF-ready.",
  },
  {
    title: "Editable Source, Immutable PDF",
    desc: "Edit original notes anytime and regenerate PDFs without losing structure.",
  },
  {
    title: "Upload & Manage Documents",
    desc: "Upload your own PDFs, organize them, view anytime — editing stays protected.",
  },
  {
    title: "Distraction-free Design",
    desc: "Minimal UI focused on writing, reading, and thinking clearly.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="space-y-16">

      {/* SECTION HEADER */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">
          Built for serious note-taking
        </h2>
        <p className="max-w-2xl mx-auto text-[var(--color-muted)]">
          A document-first approach where notes are not just text,
          but structured, editable sources that generate real PDFs.
        </p>
      </div>

      {/* FEATURE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="
              bg-[var(--color-surface)]
              border border-[var(--color-border)]
              rounded-xl p-6
              transition
              hover:-translate-y-2
              hover:shadow-lg
              motion-safe:animate-fadeIn
            "
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <h3 className="font-semibold text-lg mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-[var(--color-muted)]">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
