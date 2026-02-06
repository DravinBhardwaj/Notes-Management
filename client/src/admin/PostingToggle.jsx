import API from "../utils/api";

const PostingToggle = ({ enabled, onToggle }) => {
  const toggle = async () => {
    const res = await API.post("/admin/posting-toggle");
    onToggle(res.data.postingEnabled);
  };

  return (
    <div className="rounded-xl p-5 flex justify-between items-center bg-[#1f2937]/80 border border-white/10">
      <div>
        <h3 className="font-semibold text-lg text-white">
          Posting Window
        </h3>
        <p className="text-sm text-gray-400">
          Allow admins to create public notes
        </p>
      </div>

      <button
        onClick={toggle}
        className={`px-5 py-2 rounded-lg font-medium ${
          enabled
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}
      >
        {enabled ? "Enabled" : "Disabled"}
      </button>
    </div>
  );
};

export default PostingToggle;
