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
  groupId,
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

  const canChangeVisibility =
    user?.role === "superadmin" || user?.isGroupAdmin === true;

  const canDelete =
    user?.role === "superadmin" || user?.isGroupAdmin === true;

  const canDownload =
    visibility === "public" ||
    isOwner ||
    user?.role === "superadmin";

  const showMakePublic =
    canChangeVisibility && visibility === "private";

  const showMakePrivate =
    canChangeVisibility && visibility === "public";

  /* ================= ACTIONS ================= */

  const handleMakePublic = async () => {
    try {
      await API.put(`/notes/${noteId}`, {
        visibility: "public",
      });

      toast.success(`"${title}" is now PUBLIC`);

      onVisibilityChange?.(noteId, "public");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Action not allowed"
      );
    }
  };

  const handleMakePrivate = async () => {
    try {
      await API.put(`/notes/${noteId}`, {
        visibility: "private",
      });

      toast.success(`"${title}" is now PRIVATE`);

      onVisibilityChange?.(noteId, "private");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Action not allowed"
      );
    }
  };

  const handleDownload = async () => {
    try {
      const res = await API.get(
        `/notes/${noteId}/download`,
        {
          responseType: "blob",
        }
      );

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

  return (
    <div className="bg-[var(--color-surface)] border rounded-xl p-5">
      
      {/* AI TOOLS TOP RIGHT */}
      {/* AI TOOLS + CHAT PDF */}
{/* TOP SECTION */}
{/* TOP SECTION */}
<div className="mb-4">

  <h3 className="font-semibold break-words text-lg mb-3">
    {title}
  </h3>

  {(isOwner || user?.role === "superadmin") && (
    <div className="flex flex-wrap gap-2">

      <Link
        to={`/chat/${noteId}`}
        className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700"
      >
        💬 Chat PDF
      </Link>

      <Link
        to={`/ai/${noteId}`}
        className="px-3 py-1 rounded bg-purple-600 text-white text-xs hover:bg-purple-700"
      >
        🤖 AI Tools
      </Link>

    </div>
  )}

</div>

      {/* GROUP INFO */}
      {user?.role === "superadmin" && groupId && (
        <div className="text-xs mt-1 text-purple-400">
          Group: {groupId}
        </div>
      )}

      {/* VISIBILITY */}
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
      <div className="flex items-center gap-4 mt-6 text-sm flex-wrap">
        
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

        {/* EDIT ONLY FOR GENERATED NOTES */}
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