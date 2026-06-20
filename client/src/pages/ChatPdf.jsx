import {
  useEffect,
  useState,
  useRef,
} from "react";

import { useParams } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";

const ChatPdf = () => {
  const { noteId } = useParams();

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const bottomRef = useRef(null);

  /* ================= LOAD CHAT ================= */

  const loadChat = async () => {
    try {
      const res = await API.get(
        `/ai/${noteId}/chat`
      );

      setMessages(
        res.data.messages || []
      );
    } catch (error) {
      toast.error(
        "Failed to load chat"
      );
    }
  };

  useEffect(() => {
    loadChat();
  }, [noteId]);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */

  const sendMessage = async () => {
    if (!input.trim() || loading)
      return;

    const currentMessage =
      input.trim();

    setInput("");
    setLoading(true);

    try {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: currentMessage,
        },
      ]);

      const res =
        await API.post(
          `/ai/${noteId}/chat`,
          {
            message:
              currentMessage,
          }
        );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            res.data.answer,
        },
      ]);
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Failed to send message"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= CLEAR CHAT ================= */

  const clearChat = async () => {
    try {
      await API.delete(
        `/ai/${noteId}/chat`
      );

      setMessages([]);

      toast.success(
        "Chat cleared"
      );
    } catch {
      toast.error(
        "Failed to clear chat"
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">

        <div>
          <h1 className="text-4xl font-bold">
            💬 Chat PDF
          </h1>

          <p className="text-gray-400 mt-2">
            Ask questions about
            your document
          </p>
        </div>

        <button
          onClick={clearChat}
          className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl text-white"
        >
          Clear Chat
        </button>

      </div>

      {/* CHAT BOX */}

      <div
        className="
        bg-slate-900
        border
        border-slate-700
        rounded-2xl
        p-4
        h-[65vh]
        min-h-[450px]
        overflow-y-auto
        flex
        flex-col
        gap-4
      "
      >

        {messages.length === 0 && (
          <div className="m-auto text-center text-gray-400">

            <div className="text-6xl mb-4">
              🤖
            </div>

            <p>
              Start chatting with
              your PDF
            </p>

          </div>
        )}

        {messages.map(
          (msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role ===
                "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`
                px-4 py-3
                rounded-2xl
                max-w-[90%]
                md:max-w-[75%]
                whitespace-pre-wrap
                break-words
                ${
                  msg.role ===
                  "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-white"
                }
              `}
              >
                <ReactMarkdown>
                  {msg.content}
               </ReactMarkdown>
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="flex justify-start">

            <div className="bg-slate-700 text-white px-4 py-3 rounded-2xl">
              Thinking...
            </div>

          </div>
        )}

        <div ref={bottomRef} />

      </div>

      {/* INPUT */}

      {/* INPUT */}
<div className="flex flex-col sm:flex-row gap-3 mt-4">

  <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !loading) {
        sendMessage();
      }
    }}
    placeholder="Ask anything about this PDF..."
    className="
      w-full
      flex-1
      px-4
      py-4
      rounded-xl
      bg-slate-800
      border
      border-slate-700
      text-white
      placeholder-gray-400
      outline-none
      focus:border-green-500
    "
  />

  <button
    onClick={sendMessage}
    disabled={loading}
    className="
      w-full
      sm:w-auto
      bg-green-600
      hover:bg-green-700
      disabled:opacity-50
      px-6
      py-4
      rounded-xl
      text-white
      font-semibold
      min-w-[120px]
    "
  >
    {loading ? "..." : "Send"}
  </button>

</div>

    </div>
  );
};

export default ChatPdf;