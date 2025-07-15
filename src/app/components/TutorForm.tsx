"use client";

import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const boards = ["UPMSP", "CBSE"];
const languages = ["hindi", "english"];
const classes = ["10", "12"];
const subjects = ["math", "science"];

type Message = {
  sender: "user" | "ai";
  content: string;
};

export default function TutorPage() {
  const [form, setForm] = useState({
    board: "",
    language: "",
    classLevel: "",
    subject: "",
  });

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = async () => {
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", content: question }]);
    setQuestion("");
    setLoading(true);

    const { board, language, classLevel, subject } = form;

    if (!board || !language || !classLevel || !subject) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          content:
            "⚠️ Please select all filters (Board, Language, Class, Subject) to receive an AI response.",
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("https://ai-book-reader.onrender.com/ask", {
        board,
        language,
        classLevel,
        subject,
        question,
      });

      const answer = res.data.answer || "⚠️ No answer received from AI.";
      setMessages((prev) => [...prev, { sender: "ai", content: answer }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", content: "❌ Error: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-center text-[#121416]">
          📚 AI Tutor
        </h1>
      </header>

      {/* Filter Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <select
          name="board"
          value={form.board}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        >
          <option value="">Select Board</option>
          {boards.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          name="language"
          value={form.language}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        >
          <option value="">Select Language</option>
          {languages.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <select
          name="classLevel"
          value={form.classLevel}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Chat Window */}
      <div className="bg-gray-50 border rounded-lg p-4 mb-4 max-h-[500px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ children }) => (
                    <p className="text-sm leading-relaxed">{children}</p>
                  ),
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left text-sm text-gray-500">🤖 Thinking...</div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your question..."
          className="flex-1 border p-3 rounded-lg"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
