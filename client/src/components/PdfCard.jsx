import { Link } from "react-router-dom";
import { useContext, useMemo } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const PdfCard = ({
  title,
  type,
  date,
  fileUrl,
  noteId,
  visibility = "private",
  owner,
  groupId,                 //  optional (for superadmin UI)
  onDelete,
  onVisibilityChange,
}) => {
  const { user } = useContext(AuthContext);

  /* ================= OWNERSHIP ================= */
  const isOwner = useMemo(
    () => String(owner) === String(user?._id),
    [owner, user?._id]
  );

  /* ================= PERMISSIONS ================= */

  // visibility change → admin / superadmin
  const canChangeVisibility =
    user?.role === "superadmin" || user?.isGroupAdmin === true;

  // delete → admin / superadmin (backend enforces final rule)
  const canDelete =
    user?.role === "superadmin" || user?.isGroupAdmin === true;

  // download → public OR owner OR superadmin
  const canDownload =
    visibility === "public" || isOwner || user?.role === "superadmin";

  const showMakePublic =
    canChangeVisibility && visibility === "private";

  const showMakePrivate =
    canChangeVisibility && visibility === "public";

  /* ================= ACTIONS ================= */

  const handleMakePublic = async () => {
    try {
      await API.put(`/notes/${noteId}`, { visibility: "public" });
      toast.success(`"${title}" is now PUBLIC`);
      onVisibilityChange?.(noteId, "public");
    } catch (err) {
      toast.error(err.response?.data?.message || "Action not allowed");
    }
  };

  const handleMakePrivate = async () => {
    try {
      await API.put(`/notes/${noteId}`, { visibility: "private" });
      toast.success(`"${title}" is now PRIVATE`);
      onVisibilityChange?.(noteId, "private");
    } catch (err) {
      toast.error(err.response?.data?.message || "Action not allowed");
    }
  };

  const handleDownload = async () => {
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
    } catch {
      toast.error("Failed to download PDF");
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="bg-[var(--color-surface)] border rounded-xl p-5">
      {/* TITLE */}
      <h3 className="font-semibold truncate">{title}</h3>

      {/* GROUP INFO (SUPER ADMIN ONLY) */}
      {user?.role === "superadmin" && groupId && (
        <div className="text-xs mt-1 text-purple-400">
          Group: {groupId}
        </div>
      )}

      {/* VISIBILITY BADGE */}
      <span
        className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
          visibility === "public"
            ? "bg-green-600 text-white"
            : "bg-gray-600 text-white"
        }`}
      >
        {visibility.toUpperCase()}
      </span>

      {/* DATE */}
      <p className="text-xs text-[var(--color-muted)] mt-2">
        {date}
      </p>

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-4 mt-4 text-sm">
        <Link
          to={`/view-pdf?url=${encodeURIComponent(fileUrl)}`}
          className="text-[var(--color-primary)] hover:underline"
        >
          View
        </Link>

        {canDownload && (
          <button
            onClick={handleDownload}
            className="text-green-400 hover:underline"
          >
            Download
          </button>
        )}

        {/* EDIT → only generated notes */}
        {type === "generated" &&
          (isOwner || user?.role === "superadmin") && (
            <Link
              to={`/edit/${noteId}`}
              className="text-yellow-400 hover:underline"
            >
              Edit
            </Link>
          )}

        {showMakePublic && (
          <button
            onClick={handleMakePublic}
            className="text-blue-400 hover:underline"
          >
            Make Public
          </button>
        )}

        {showMakePrivate && (
          <button
            onClick={handleMakePrivate}
            className="text-blue-400 hover:underline"
          >
            Make Private
          </button>
        )}

        {canDelete && (
          <button
            onClick={onDelete}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default PdfCard;
