import { useState } from "react";
import PdfCard from "../components/PdfCard";

const Documents = () => {
  const [documents, setDocuments] = useState([
    {
      id: "pdf1",
      noteId: "note1",
      title: "Project Notes.pdf",
      type: "generated",
      date: "Today",
      fileUrl: "#",
    },
    {
      id: "pdf2",
      noteId: "note2",
      title: "Resume.pdf",
      type: "uploaded",
      date: "Yesterday",
      fileUrl: "#",
    },
    {
      id: "pdf3",
      noteId: "note3",
      title: "Meeting Summary.pdf",
      type: "generated",
      date: "2 days ago",
      fileUrl: "#",
    },
  ]);

  const [search, setSearch] = useState("");

  /* DELETE PDF (frontend only) */
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this PDF?"
    );
    if (!confirmDelete) return;

    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Documents</h1>
          <p className="text-sm text-[var(--color-muted)]">
            All your generated and uploaded PDFs
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search PDFs..."
            className="
              bg-[var(--color-surface)]
              border border-[var(--color-border)]
              rounded-lg px-3 py-2 text-sm
              outline-none
            "
          />

          <label className="bg-[var(--color-primary)] text-black px-4 py-2 rounded-lg cursor-pointer text-sm">
            Upload PDF
            <input type="file" accept=".pdf" hidden />
          </label>
        </div>
      </div>

      {/* PDF GRID */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-lg font-medium">No documents found</p>
          <p className="text-sm text-[var(--color-muted)] mt-2">
            Upload a PDF or generate one from your notes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <PdfCard
              key={doc.id}
              {...doc}
              onDelete={() => handleDelete(doc.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
