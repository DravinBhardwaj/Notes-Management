import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import EditorPage from "../components/EditorPage";

const MAX_PAGES = 10;
const MAX_CHARS_PER_PAGE = 3500;

const EditNote = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [pageColor, setPageColor] = useState("#FFF6D5");

  const [pages, setPages] = useState([]);
  const pageRefs = useRef({});

  /* ---------- LOAD NOTE (FRONTEND MOCK) ---------- */
  useEffect(() => {
    // Later replace with API call using noteId
    const mockNote = {
      title: "Project Notes",
      pages: [
        {
          id: Date.now(),
          html: `<p>These are the original notes that were used to generate the PDF.</p>
                 <p>You can edit them and regenerate the PDF.</p>`,
        },
      ],
    };

    setTitle(mockNote.title);
    setPages(mockNote.pages);
  }, [noteId]);

  /* ---------- FORMATTING ---------- */
  const exec = (cmd, value = null) => {
    document.execCommand("styleWithCSS", false, true);
    document.execCommand(cmd, false, value);
  };

  const applyFontSize = (size) => {
    document.execCommand("styleWithCSS", false, true);
    document.execCommand("fontSize", false, "1");

    document.querySelectorAll("font").forEach((f) => {
      f.removeAttribute("size");
      f.style.fontSize = size;
      f.style.color = "#1F2937";
    });
  };

  /* ---------- ADD PAGE ---------- */
  const addPage = () => {
    if (pages.length >= MAX_PAGES) {
      alert(`Maximum ${MAX_PAGES} pages allowed`);
      return;
    }
    setPages([...pages, { id: Date.now(), html: "<p><br/></p>" }]);
  };

  /* ---------- DELETE PAGE ---------- */
  const deletePage = (index) => {
    if (pages.length === 1) {
      alert("At least one page is required");
      return;
    }
    setPages(pages.filter((_, i) => i !== index));
  };

  /* ---------- LIMIT CONTENT ---------- */
  const handleInput = (e) => {
    if (e.target.innerText.length > MAX_CHARS_PER_PAGE) {
      e.target.innerText = e.target.innerText.slice(0, MAX_CHARS_PER_PAGE);
    }
  };

  /* ---------- UPDATE NOTE ---------- */
  const handleUpdateNote = () => {
    const updatedPages = pages.map((p) => ({
      html: pageRefs.current[p.id]?.innerHTML || "",
      bgColor: pageColor,
    }));

    if (!title || updatedPages.every((p) => !p.html.trim())) {
      alert("Title and content required");
      return;
    }

    console.log("Updated Note:", { noteId, title, updatedPages });
    alert("Note updated (frontend only)");
  };

  /* ---------- RE-GENERATE PDF ---------- */
  const handleRegeneratePdf = () => {
    alert("PDF re-generation will be handled by backend");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Edit Note</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Update your note and regenerate the PDF
        </p>
      </div>

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
            className="px-3 py-1 rounded bg-indigo-200 text-black text-sm font-semibold"
          >
            {cmd[0].toUpperCase()}
          </button>
        ))}

        <button onClick={() => exec("insertUnorderedList")} className="editor-btn">•</button>
        <button onClick={() => exec("insertOrderedList")} className="editor-btn">1.</button>

        <select
          onChange={(e) => applyFontSize(e.target.value)}
          className="border rounded px-2 bg-white text-sm"
        >
          <option value="14px">Normal</option>
          <option value="18px">Large</option>
          <option value="22px">XL</option>
        </select>

        <input type="color" onChange={(e) => exec("foreColor", e.target.value)} />
        <input type="color" value={pageColor} onChange={(e) => setPageColor(e.target.value)} />

        <button
          onClick={addPage}
          className="px-3 py-1 bg-[var(--color-primary)] text-black rounded"
        >
          + Page
        </button>
      </div>

      {/* PAGES */}
      <div className="h-[65vh] overflow-y-auto bg-gray-200 p-6 rounded-lg space-y-10">
        {pages.map((page, index) => (
          <EditorPage
            key={page.id}
            index={index}
            pageColor={pageColor}
            initialHtml={page.html}
            canDelete={pages.length > 1}
            onDelete={deletePage}
            onInput={handleInput}
            pageRef={(el) => (pageRefs.current[page.id] = el)}
          />
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleUpdateNote}
          className="bg-[var(--color-primary)] text-black px-6 py-2 rounded-lg"
        >
          Update Note
        </button>

        <button
          onClick={handleRegeneratePdf}
          className="border px-6 py-2 rounded-lg"
        >
          Re-generate PDF
        </button>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-lg border text-[var(--color-muted)] hover:bg-[var(--color-surface)]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditNote;
