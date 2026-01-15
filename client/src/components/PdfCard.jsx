import { Link } from "react-router-dom";

const PdfCard = ({ title, type, date, fileUrl, noteId, onDelete }) => {
  return (
    <div
      className="
        bg-[var(--color-surface)]
        border border-[var(--color-border)]
        rounded-xl p-5
        hover:-translate-y-1 transition
      "
    >
      <h3 className="font-semibold text-lg">{title}</h3>

      <p className="text-sm text-[var(--color-muted)] mt-2">
        {type === "generated" ? "Generated PDF" : "Uploaded PDF"}
      </p>

      <p className="text-xs text-[var(--color-muted)] mt-1">
        {date}
      </p>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mt-4 text-sm">

        {/* VIEW */}
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--color-primary)] hover:underline"
        >
          View
        </a>

        {/* EDIT NOTE (only for generated PDFs) */}
        {type === "generated" && (
          <Link
    to={`/edit/${noteId}`}
    className="text-yellow-400 hover:underline"
  >
    Edit
  </Link>
        )}

        {/* DELETE */}
        <button
          onClick={onDelete}
          className="text-red-500 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PdfCard;
