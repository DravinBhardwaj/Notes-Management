const EditorPage = ({
  index,
  pageColor,
  onDelete,
  onInput,
  pageRef,
  canDelete,
  onFocus,
}) => {
  return (
    <div
      ref={pageRef}
      contentEditable
      onInput={onInput}
      onFocus={onFocus}
      className="
        relative
        min-h-[650px]
        bg-white
        p-6
        outline-none
        shadow
        rounded
        text-[14px]
        text-[#111]
      "
      style={{ backgroundColor: pageColor }}
    >
      {canDelete && (
        <button
          onClick={() => onDelete(index)}
          className="absolute top-2 right-2 text-xs text-red-500 hover:underline"
          contentEditable={false}
        >
          Delete Page
        </button>
      )}
      <p><br /></p>
    </div>
  );
};

export default EditorPage;
