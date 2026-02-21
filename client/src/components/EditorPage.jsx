import { useEffect, useRef } from "react";

const EditorPage = ({
  index,
  pageColor,
  pageHtml,        // ✅ initial html for edit mode
  onDelete,
  canDelete,
  onInput,
  onFocus,
  registerRef,
  isActive,
}) => {
  const localRef = useRef(null);

  /* ================= REGISTER REF ================= */
  useEffect(() => {
    if (localRef.current && registerRef) {
      registerRef(localRef.current);
    }
  }, []);

  /* ================= LOAD INITIAL HTML (ONLY ONCE) ================= */
  useEffect(() => {
    if (localRef.current && pageHtml) {
      localRef.current.innerHTML = pageHtml;
    }
  }, []);

  /* ================= AUTO FOCUS ACTIVE PAGE ================= */
  useEffect(() => {
    if (isActive && localRef.current) {
      localRef.current.focus();
    }
  }, [isActive]);

  return (
    <div className="relative">
      {/* Delete Button */}
      {canDelete && (
        <button
          onClick={() => onDelete(index)}
          contentEditable={false}
          className="absolute top-2 right-2 text-xs text-red-600 hover:underline z-10"
        >
          Delete Page
        </button>
      )}

      {/* Editable Page */}
      <div
        ref={localRef}
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
        onFocus={onFocus}
        className="min-h-[900px] p-6 outline-none rounded-lg shadow bg-white text-black text-[14px]"
        style={{
          backgroundColor: pageColor,
          color: "#000",
          caretColor: "#000",
        }}
      />
    </div>
  );
};

export default EditorPage;