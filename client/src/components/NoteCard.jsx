import PdfCard from "../components/PdfCard";

const Documents = () => {
  const documents = [
    { id: 1, title: "Meeting Notes.pdf", type: "generated", date: "Today" },
    { id: 2, title: "Resume.pdf", type: "uploaded", date: "Yesterday" },
    { id: 3, title: "Ideas.pdf", type: "generated", date: "2 days ago" },
  ];

  return (
    <div className="space-y-10">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Your Documents</h1>

        {/* Upload UI only */}
        <label className="bg-[var(--color-primary)] text-black px-4 py-2 rounded-lg cursor-pointer text-sm">
          Upload PDF
          <input type="file" accept=".pdf" hidden />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <PdfCard
            key={doc.id}
            title={doc.title}
            type={doc.type}
            date={doc.date}
          />
        ))}
      </div>

    </div>
  );
};

export default Documents;
