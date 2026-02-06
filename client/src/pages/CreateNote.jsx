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
  const [pageColor, setPageColor] = useState("#EAF4FF");

  const [pages, setPages] = useState([{ id: Date.now() }]);
  const [activePageId, setActivePageId] = useState(pages[0].id);

  const [pdfUrl, setPdfUrl] = useState(null);
  const [noteId, setNoteId] = useState(null);

  const pageRefs = useRef({});

  /* ================= BASIC COMMAND ================= */
  const exec = (command, value = null) => {
    const page = pageRefs.current[activePageId];
    if (!page) return;
    page.focus();
    document.execCommand(command, false, value);
  };

  /* ================= FONT SIZE ================= */
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

  /* ================= ADD PAGE ================= */
  const addPage = () => {
    if (pages.length >= MAX_PAGES) {
      toast.warning(`Maximum ${MAX_PAGES} pages allowed`);
      return;
    }

    const newPage = { id: Date.now() };
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
        bgColor: pageColor,
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
setNoteId(data._id); //  THIS LINE WAS MISSING
toast.success("PDF generated successfully");

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate PDF");
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

      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-2 border p-2 rounded-lg bg-[var(--color-surface)]">
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

        <input
          type="color"
          onChange={(e) => exec("foreColor", e.target.value)}
        />
        <input
          type="color"
          value={pageColor}
          onChange={(e) => setPageColor(e.target.value)}
        />

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
            pageColor={pageColor}
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
