import { useEffect, useState, useContext, useMemo } from "react";
import PdfCard from "../components/PdfCard";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { confirmToast } from "../utils/confirmToast";

const Documents = () => {
  const { user } = useContext(AuthContext);

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");

  /* ================= FETCH DOCUMENTS ================= */
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get("/notes");

        const docs = res.data.map((note) => ({
          id: note._id,
          noteId: note._id,
          title: note.title,              //  FIX (no .pdf here)
          type: note.type,
          visibility: note.visibility || "private",
          owner: note.user,
          groupId: note.groupId,           //  ADD (for superadmin view)
          date: new Date(note.createdAt).toDateString(),
          fileUrl: note.pdfUrl,
        }));

        setDocuments(docs);
      } catch {
        toast.error("Failed to load documents");
      }
    };

    fetchNotes();
  }, []);

  /* ================= VISIBILITY UPDATE ================= */
  const handleVisibilityChange = (noteId, visibility) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.noteId === noteId ? { ...doc, visibility } : doc
      )
    );
  };

  /* ================= UPLOAD PDF ================= */
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.warning("Only PDF files are allowed");
      e.target.value = null;
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await API.post("/notes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDocuments((prev) => [
        {
          id: res.data._id,
          noteId: res.data._id,
          title: res.data.title,           // clean title
          type: "uploaded",
          visibility: "private",
          owner: user._id,
          groupId: res.data.groupId,       //  keep consistent
          date: "Just now",
          fileUrl: res.data.pdfUrl,
        },
        ...prev,
      ]);

      toast.success("PDF uploaded successfully");
    } catch {
      toast.error("PDF upload failed");
    } finally {
      e.target.value = null;
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    confirmToast({
      message: "Delete this PDF permanently?",
      onConfirm: async () => {
        try {
          await API.delete(`/notes/${id}`);
          setDocuments((prev) => prev.filter((doc) => doc.id !== id));
          toast.success("PDF deleted successfully");
        } catch {
          toast.error("Failed to delete PDF");
        }
      },
    });
  };

  /* ================= SEARCH FILTER ================= */
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [documents, search]);

  /* ================= PRIVATE NOTES ================= */
  const privateDocs = useMemo(() => {
    return filteredDocs.filter((doc) => {
      if (doc.visibility !== "private") return false;

      // 👑 Superadmin sees ALL private notes
      if (user.role === "superadmin") return true;

      // Others see only their own
      return String(doc.owner) === String(user._id);
    });
  }, [filteredDocs, user.role, user._id]);

  /* ================= PUBLIC NOTES ================= */
  const publicDocs = useMemo(() => {
    return filteredDocs.filter((doc) => doc.visibility === "public");
  }, [filteredDocs]);

  /* ================= RENDER ================= */
  return (
    <div className="space-y-14">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Documents</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Private notes are visible only to you.  
            Public notes are shared by admins.
          </p>
        </div>

        {/* SEARCH + UPLOAD */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search PDFs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[var(--color-surface)] border rounded-lg px-3 py-2 text-sm outline-none"
          />

          <label className="bg-[var(--color-primary)] text-black px-4 py-2 rounded-lg cursor-pointer text-sm">
            Upload PDF
            <input
              type="file"
              accept=".pdf"
              hidden
              onChange={handleUpload}
            />
          </label>
        </div>
      </div>

      {/* PRIVATE NOTES */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">🔒 My Private Notes</h2>

        {privateDocs.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">
            No private notes
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {privateDocs.map((doc) => (
              <PdfCard
                key={doc.id}
                {...doc}
                onDelete={() => handleDelete(doc.id)}
                onVisibilityChange={handleVisibilityChange}
              />
            ))}
          </div>
        )}
      </section>

      {/* PUBLIC NOTES */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">🌍 Public Notes</h2>

        {publicDocs.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">
            No public notes available
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicDocs.map((doc) => (
              <PdfCard
                key={doc.id}
                {...doc}
                onDelete={() => handleDelete(doc.id)}
                onVisibilityChange={handleVisibilityChange}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Documents;
