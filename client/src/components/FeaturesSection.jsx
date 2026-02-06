const features = [
  {
    title: "Structured Page Editor",
    desc: "Create notes in a page-based format that mirrors real academic documents, ensuring clarity and consistency.",
  },
  {
    title: "Editable Notes with PDF Output",
    desc: "Update your notes anytime and regenerate clean PDFs without breaking layout or formatting.",
  },
  {
    title: "Secure Document Management",
    desc: "Upload, organize, and access your PDFs in one place while maintaining strict ownership and access control.",
  },
  {
    title: "Focused Study Experience",
    desc: "A minimal, distraction-free interface designed to help you write, read, and revise efficiently.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="space-y-16">

      {/* SECTION HEADER */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">
          Designed for academic workflows
        </h2>
        <p className="max-w-2xl mx-auto text-[var(--color-muted)]">
          A structured note-taking system built to support focused study,
          revision, and reliable document generation.
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
