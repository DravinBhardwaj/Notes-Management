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

  /* ================= FORMATTING ================= */
  const exec = (cmd, value = null) => {
    const page = pageRefs.current[activePageId];
    if (!page) return;
    page.focus();
    document.execCommand(cmd, false, value);
  };

  const applyFontSize = (size) => {
    const page = pageRefs.current[activePageId];
    if (!page) return;

    page.focus();
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = size;
    span.style.color = "#000";

    span.appendChild(range.extractContents());
    range.insertNode(span);
    selection.removeAllRanges();
  };

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
        className="w-full bg-[var(--color-surface)] border rounded-lg px-4 py-3"
      />

      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-2 border p-2 rounded bg-[var(--color-surface)]">
        {["bold", "italic", "underline"].map((cmd) => (
          <button
            key={cmd}
            onClick={() => exec(cmd)}
            className="px-3 py-1 bg-[var(--color-primary)] text-black rounded"
          >
            {cmd[0].toUpperCase()}
          </button>
        ))}

        <button onClick={() => exec("insertUnorderedList")}>•</button>
        <button onClick={() => exec("insertOrderedList")}>1.</button>

        <select
          onChange={(e) => applyFontSize(e.target.value)}
          className="px-3 py-1 bg-[var(--color-primary)] text-black rounded"
        >
          <option value="14px">Normal</option>
          <option value="18px">Large</option>
          <option value="22px">XL</option>
        </select>

        <input type="color" onChange={(e) => exec("foreColor", e.target.value)} />

        {/* Per Page Background Color */}
        <input
          type="color"
          value={
            pages.find((p) => p.id === activePageId)?.bgColor || "#FFF6D5"
          }
          onChange={(e) => changePageColor(e.target.value)}
        />

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