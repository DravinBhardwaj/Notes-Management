import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../utils/api";
import ReactMarkdown from "react-markdown";

const AiNote = () => {
  const { noteId } = useParams();

  const [note, setNote] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  const fetchNote = async () => {
    try {
      const res = await API.get(`/notes/${noteId}`);
      setNote(res.data);
    } catch {
      toast.error("Failed to load note");
    }
  };

  useEffect(() => {
    fetchNote();
  }, [noteId]);

  const generateSummary = async () => {
    try {
      setSummaryLoading(true);

      await API.post(`/ai/${noteId}/summary`);

      await fetchNote();

      toast.success("Summary generated");
    } catch {
      toast.error("Failed to generate summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  const generateQuestions = async () => {
    try {
      setQuestionsLoading(true);

      await API.post(`/ai/${noteId}/questions`);

      await fetchNote();

      toast.success("Questions generated");
    } catch {
      toast.error("Failed to generate questions");
    } finally {
      setQuestionsLoading(false);
    }
  };

  const deleteSummary = async () => {
    try {
      await API.delete(`/ai/${noteId}/summary`);

      await fetchNote();

      toast.success("Summary deleted");
    } catch {
      toast.error("Failed to delete summary");
    }
  };

  const deleteQuestions = async () => {
    try {
      await API.delete(`/ai/${noteId}/questions`);

      await fetchNote();

      toast.success("Questions deleted");
    } catch {
      toast.error("Failed to delete questions");
    }
  };

  const copySummary = () => {
  navigator.clipboard.writeText(note?.summary || "");
  toast.success("Summary copied");
};

  const copyQuestions = () => {
  navigator.clipboard.writeText(
    note?.questions?.join("\n\n") || ""
  );

  toast.success("Questions copied");
};
  if (!note) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl">
        Loading...
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto py-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          🤖 AI Study Assistant
        </h1>

        <p className="text-lg text-gray-400">
          {note.title}
        </p>
      </div>

      {/* SUMMARY */}
      <div className="bg-[var(--color-surface)] border rounded-2xl p-6 mb-8">

        <div className="flex flex-wrap justify-between items-center gap-3 mb-5">

          <h2 className="text-2xl font-bold">
            📄 Summary
          </h2>

          <div className="flex gap-2 flex-wrap">

            <button
              onClick={generateSummary}
              disabled={summaryLoading}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white"
            >
              {summaryLoading
                ? "Generating..."
                : "Generate Summary"}
            </button>

            <button
              onClick={copySummary}
              className="bg-slate-700 hover:bg-slate-800 px-4 py-2 rounded-lg text-white"
            >
              Copy
            </button>

            <button
              onClick={deleteSummary}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
            >
              Delete
            </button>

          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 min-h-[300px] text-gray-200 overflow-auto">

  {note?.summary ? (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold mb-3 mt-6">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold mb-2 mt-4">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mb-3 leading-7">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc ml-6 mb-4">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal ml-6 mb-4">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="mb-1">{children}</li>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-white">
            {children}
          </strong>
        ),
      }}
    >
      {note.summary}
    </ReactMarkdown>
  ) : (
    "Generate a summary to start studying."
  )}

</div>

      </div>

      {/* QUESTIONS */}
      <div className="bg-[var(--color-surface)] border rounded-2xl p-6">

        <div className="flex flex-wrap justify-between items-center gap-3 mb-5">

          <h2 className="text-2xl font-bold">
            ❓ Important Questions
          </h2>

          <div className="flex gap-2 flex-wrap">

            <button
              onClick={generateQuestions}
              disabled={questionsLoading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
            >
              {questionsLoading
                ? "Generating..."
                : "Generate Questions"}
            </button>

            <button
              onClick={copyQuestions}
              className="bg-slate-700 hover:bg-slate-800 px-4 py-2 rounded-lg text-white"
            >
              Copy
            </button>

            <button
              onClick={deleteQuestions}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
            >
              Delete
            </button>

          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 min-h-[300px] text-gray-200">

          {note?.questions?.length > 0 ? (
            note.questions.map((q, index) => (
              <div
                key={index}
                className="mb-4 pb-4 border-b border-slate-700 last:border-0"
              >
                <span className="text-blue-400 font-semibold">
                  Q{index + 1}.
                </span>{" "}
                {q}
              </div>
            ))
          ) : (
            <p>
              Generate important questions from this document.
            </p>
          )}

        </div>

      </div>

    </div>
  );
};

export default AiNote;