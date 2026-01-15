import { useState, useRef } from "react";
import EditorPage from "../components/EditorPage";

const MAX_PAGES = 10;
const MAX_CHARS_PER_PAGE = 3500;

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [pageColor, setPageColor] = useState("#EAF4FF");

  const [pages, setPages] = useState([{ id: Date.now() }]);
  const [activePageId, setActivePageId] = useState(pages[0].id);

  const pageRefs = useRef({});

  /* ---------- BASIC COMMAND ---------- */
  const exec = (command, value = null) => {
    const page = pageRefs.current[activePageId];
    if (!page) return;

    page.focus();
    document.execCommand(command, false, value);
  };

  /* ---------- FONT SIZE (SAFE) ---------- */
  const applyFontSize = (size) => {
    const page = pageRefs.current[activePageId];
    if (!page) return;

    page.focus();

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style.fontSize = size;
    span.style.color = "#111";

    span.appendChild(range.extractContents());
    range.insertNode(span);

    selection.removeAllRanges();
  };

  /* ---------- ADD PAGE ---------- */
  const addPage = () => {
    if (pages.length >= MAX_PAGES) {
      alert(`Maximum ${MAX_PAGES} pages allowed`);
      return;
    }

    const newPage = { id: Date.now() };
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
  };

  /* ---------- DELETE PAGE ---------- */
  const deletePage = (index) => {
    if (pages.length === 1) {
      alert("At least one page is required");
      return;
    }

    const updated = pages.filter((_, i) => i !== index);
    setPages(updated);
    setActivePageId(updated[0].id);
  };

  /* ---------- LIMIT CONTENT ---------- */
  const handleInput = (e) => {
    if (e.target.innerText.length > MAX_CHARS_PER_PAGE) {
      e.target.innerText = e.target.innerText.slice(0, MAX_CHARS_PER_PAGE);
    }
  };

  /* ---------- SAVE ---------- */
  const handleSaveNote = () => {
    const content = pages.map((p) => ({
      html: pageRefs.current[p.id]?.innerHTML || "",
      bgColor: pageColor,
    }));

    if (!title || content.every((p) => !p.html.trim())) {
      alert("Title and content required");
      return;
    }

    console.log({ title, content });
    alert("Note saved (frontend only)");
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
        className="
          w-full
          bg-[var(--color-surface)]
          border border-[var(--color-border)]
          rounded-lg px-4 py-3
          text-lg outline-none
        "
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

        <button onClick={() => exec("insertUnorderedList")} className="editor-btn">•</button>
        <button onClick={() => exec("insertOrderedList")} className="editor-btn">1.</button>

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
          title="Text color"
        />

        <input
          type="color"
          value={pageColor}
          onChange={(e) => setPageColor(e.target.value)}
          title="Page color"
        />

        <button
          onClick={addPage}
          className="px-3 py-1 bg-[var(--color-primary)] text-black rounded"
        >
          + Page
        </button>
      </div>

      {/* EDITOR VIEWPORT */}
      <div className="h-[65vh] overflow-y-auto bg-gray-200 p-6 rounded-lg space-y-10">
        {pages.map((page, index) => (
          <EditorPage
            key={page.id}
            index={index}
            pageColor={pageColor}
            canDelete={pages.length > 1}
            onDelete={deletePage}
            onInput={handleInput}
            onFocus={() => setActivePageId(page.id)}
            pageRef={(el) => (pageRefs.current[page.id] = el)}
          />
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          onClick={handleSaveNote}
          className="bg-[var(--color-primary)] text-black px-6 py-2 rounded-lg"
        >
          Save
        </button>

        <button className="border px-6 py-2 rounded-lg">
          Generate PDF
        </button>
      </div>
    </div>
  );
};

export default CreateNote;
