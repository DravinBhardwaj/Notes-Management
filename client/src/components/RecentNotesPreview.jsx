const notes = [
  { title: "Project Architecture", date: "Today" },
  { title: "DSA Revision Notes", date: "Yesterday" },
  { title: "Resume Improvements", date: "2 days ago" },
];

const RecentNotesPreview = () => {
  return (
    <section className="space-y-10">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Recent Notes</h2>
        <span className="text-sm text-[var(--color-muted)]">
          Preview
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {notes.map((note, i) => (
          <div
            key={i}
            className="
              bg-[var(--color-surface)]
              border border-[var(--color-border)]
              rounded-xl p-5
              hover:shadow-lg transition
            "
          >
            <h3 className="font-medium">{note.title}</h3>
            <p className="text-xs text-[var(--color-muted)] mt-2">
              {note.date}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentNotesPreview;
