import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import EditorPage from "../components/EditorPage";
import API from "../utils/api";

const MAX_PAGES = 10;
const MAX_CHARS_PER_PAGE = 3500;

const EditNote = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [pages, setPages] = useState([]);
  const [activePageId, setActivePageId] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  const pageRefs = useRef({});

  /* ================= LOAD NOTE ================= */
  useEffect(() => {
    API.get(`/notes/${noteId}`)
      .then((res) => {
        const note = res.data;

        const fixedPages = note.pages.map((p) => ({
          ...p,
          id: p._id || crypto.randomUUID(),
          bgColor: p.bgColor || "#FFF6D5",
        }));

        setTitle(note.title);
        setPages(fixedPages);
        setPdfUrl(note.pdfUrl);
        setActivePageId(fixedPages[0]?.id);
      })
      .catch(() => toast.error("Failed to load note"));
  }, [noteId]);

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
      id: crypto.randomUUID(),
      html: "",
      bgColor: "#FFF6D5",
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
      toast.warning("Maximum character limit reached");
    }
  };

  /* ================= UPDATE NOTE ================= */
  const handleUpdateNote = async () => {
    try {
      const updatedPages = pages.map((p) => ({
        html: pageRefs.current[p.id]?.innerHTML || "",
        bgColor: p.bgColor,
      }));

      if (!title.trim() || updatedPages.every((p) => !p.html.trim())) {
        toast.warning("Title and content are required");
        return;
      }

      const { data } = await API.put(`/notes/${noteId}`, {
        title,
        pages: updatedPages,
      });

      setPdfUrl(data.pdfUrl);
      toast.success("Note saved & PDF regenerated");
    } catch {
      toast.error("Failed to update note");
    }
  };

  /* ================= DOWNLOAD PDF ================= */
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

      toast.success("PDF downloaded successfully");
    } catch {
      toast.error("Failed to download PDF");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* TITLE */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        className="w-full bg-[var(--color-surface)] border rounded-lg px-4 py-3"
      />

      {/* SAFE TOOLBAR */}
      <div className="flex flex-wrap gap-3 border p-3 rounded bg-[var(--color-surface)]">

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
              pages.find((p) => p.id === activePageId)?.bgColor || "#FFF6D5"
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
      <div className="h-[65vh] overflow-y-auto bg-gray-200 p-6 rounded-lg space-y-10">
        {pages.map((page, index) => (
          <EditorPage
            key={page.id}
            index={index}
            pageColor={page.bgColor}
            pageHtml={page.html}
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
      <div className="flex gap-4">
        <button
          onClick={handleUpdateNote}
          className="bg-[var(--color-primary)] text-black px-6 py-2 rounded-lg"
        >
          Save & Generate PDF
        </button>

        {pdfUrl && (
          <button
            onClick={handleDownloadPdf}
            className="border px-6 py-2 rounded-lg"
          >
            Download PDF
          </button>
        )}

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-lg border text-[var(--color-muted)]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditNote;