import { useState, useRef, useContext } from "react";
import EditorPage from "../components/EditorPage";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const MAX_PAGES = 10;
const MAX_CHARS_PER_PAGE = 3500;

const CreateNote = () => {
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");

  const [pages, setPages] = useState([
    { id: Date.now(), bgColor: "#EAF4FF" },
  ]);

  const [activePageId, setActivePageId] = useState(pages[0].id);

  const [pdfUrl, setPdfUrl] = useState(null);
  const [noteId, setNoteId] = useState(null);

  const pageRefs = useRef({});

  /* ================= SAFE TEXT INSERT ================= */

  const insertText = (text) => {
    const page = pageRefs.current[activePageId];
    if (!page) return;
    page.focus();
    document.execCommand("insertText", false, text);
  };

  const insertBullet = () => insertText("• ");
  const insertLine = () =>
    insertText("\n-----------------------------\n");
  const insertDate = () =>
    insertText(new Date().toLocaleDateString());

  /* ================= CHANGE PAGE COLOR ================= */
  const changePageColor = (color) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === activePageId ? { ...p, bgColor: color } : p
      )
    );
  };

  /* ================= ADD PAGE ================= */
  const addPage = () => {
    if (pages.length >= MAX_PAGES) {
      toast.warning(`Maximum ${MAX_PAGES} pages allowed`);
      return;
    }

    const newPage = {
      id: Date.now(),
      bgColor: "#EAF4FF",
    };

    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
  };

  /* ================= DELETE PAGE ================= */
  const deletePage = (index) => {
    if (pages.length === 1) {
      toast.warning("At least one page is required");
      return;
    }

    const updated = pages.filter((_, i) => i !== index);
    setPages(updated);
    setActivePageId(updated[0].id);
  };

  /* ================= LIMIT CONTENT ================= */
  const handleInput = (e) => {
    if (e.target.innerText.length > MAX_CHARS_PER_PAGE) {
      e.target.innerText = e.target.innerText.slice(0, MAX_CHARS_PER_PAGE);
    }
  };

  /* ================= GENERATE PDF ================= */
  const handleGeneratePdf = async () => {
    try {
      const pagesData = pages.map((p) => ({
        html: pageRefs.current[p.id]?.innerHTML || "",
        bgColor: p.bgColor,
      }));

      if (!title.trim() || pagesData.every((p) => !p.html.trim())) {
        toast.warning("Title and content required");
        return;
      }

      const { data } = await API.post("/notes", {
        title,
        pages: pagesData,
      });

      setPdfUrl(data.pdfUrl);
      setNoteId(data._id);
      toast.success("PDF generated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate PDF"
      );
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await API.get(`/notes/${noteId}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download PDF");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Create Note</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Page-based editor (PDF ready)
        </p>
      </div>

      {/* TITLE */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        className="w-full bg-[var(--color-surface)] border rounded-lg px-4 py-3 text-lg outline-none"
      />

      {/* SAFE TOOLBAR */}
      <div className="flex flex-wrap gap-3 border p-3 rounded-lg bg-[var(--color-surface)]">

        <button
          onClick={insertBullet}
          className="px-3 py-1 border rounded"
        >
          • Bullet
        </button>

       

        <button
          onClick={insertLine}
          className="px-3 py-1 border rounded"
        >
          Divider
        </button>

        <button
          onClick={insertDate}
          className="px-3 py-1 border rounded"
        >
          Insert Date
        </button>

        {/* Page Background Color */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Page Color:</span>
          <input
            type="color"
            value={
              pages.find((p) => p.id === activePageId)?.bgColor ||
              "#EAF4FF"
            }
            onChange={(e) => changePageColor(e.target.value)}
          />
        </div>

        {/* Add Page */}
        <button
          onClick={addPage}
          className="px-3 py-1 bg-[var(--color-primary)] text-black rounded"
        >
          + Page
        </button>
      </div>

      {/* EDITOR */}
      <div className="bg-gray-200 p-6 rounded-lg space-y-12">
        {pages.map((page, index) => (
          <EditorPage
            key={page.id}
            index={index}
            pageColor={page.bgColor}
            canDelete={pages.length > 1}
            onDelete={deletePage}
            onInput={handleInput}
            onFocus={() => setActivePageId(page.id)}
            isActive={activePageId === page.id}
            registerRef={(el) => {
              pageRefs.current[page.id] = el;
            }}
          />
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleGeneratePdf}
          className="bg-[var(--color-primary)] text-black px-6 py-2 rounded-lg"
        >
          Generate PDF
        </button>

        <button
          disabled={!pdfUrl || !noteId}
          onClick={handleDownloadPdf}
          className={`px-6 py-2 rounded-lg border ${
            pdfUrl
              ? "hover:bg-[var(--color-surface)]"
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default CreateNote;