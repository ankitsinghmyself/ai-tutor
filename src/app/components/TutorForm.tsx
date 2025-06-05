"use client";

import { useState } from "react";
import axios from "axios";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const boards = ["UPMSP", "CBSE", "ICSE"];
const languages = ["hindi", "english"];
const classes = ["10", "11", "12"];
const subjects = ["math", "science", "history"];

export default function TutorPage() {
  const [form, setForm] = useState({
    board: "",
    language: "",
    classLevel: "",
    subject: "",
    question: "",
  });
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResponse("");
    try {
      const res = await axios.post("https://ai-book-reader.onrender.com/ask", form);
      setResponse(res.data.answer || "No response from API.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResponse("Error: " + error.message);
      } else {
        setResponse("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white overflow-x-hidden font-sans">
      <div className="mx-auto w-full h-full px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row items-center justify-between border-b border-[#f1f2f4] py-3">
          <div className="flex items-center gap-4 text-[#121416] mb-3 sm:mb-0">
            <div className="w-6 h-6 sm:w-4 sm:h-4">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold tracking-tight">EduQuery</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center">
            <nav className="flex gap-6 text-sm font-medium text-[#121416]">
              <a href="#" className="hover:underline">
                Home
              </a>
              <a href="#" className="hover:underline">
                About
              </a>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </nav>
            <div className="flex gap-2">
              <button className="h-10 px-4 bg-[#dce8f3] text-sm font-bold rounded-full">
                Sign Up
              </button>
              <button className="h-10 px-4 bg-[#f1f2f4] text-sm font-bold rounded-full">
                Login
              </button>
            </div>
          </div>
        </header>

        <main className="mt-6 mb-12">
          <h1 className="text-3xl font-bold text-[#121416] px-4 sm:px-0 mb-6">
            AI Tutor
          </h1>

          <form className="">
            {/* All dropdowns in one row */}
            <div className="flex flex-wrap gap-4">
              <label className="flex-1 min-w-[150px]">
                <span className="text-base font-medium pb-2">Board</span>
                <select
                  name="board"
                  value={form.board}
                  onChange={handleChange}
                  className="form-select w-full rounded-xl border border-[#dde1e3] h-14 p-4"
                >
                  <option value="">Select Board</option>
                  {boards.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex-1 min-w-[150px]">
                <span className="text-base font-medium pb-2">Language</span>
                <select
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  className="form-select w-full rounded-xl border border-[#dde1e3] h-14 p-4"
                >
                  <option value="">Select Language</option>
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex-1 min-w-[150px]">
                <span className="text-base font-medium pb-2">Class</span>
                <select
                  name="classLevel"
                  value={form.classLevel}
                  onChange={handleChange}
                  className="form-select w-full rounded-xl border border-[#dde1e3] h-14 p-4"
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex-1 min-w-[150px]">
                <span className="text-base font-medium pb-2">Subject</span>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="form-select w-full rounded-xl border border-[#dde1e3] h-14 p-4"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Question textarea on separate row */}
            <div className="mt-6">
              <label className="flex flex-col">
                <span className="text-base font-medium pb-2">Question</span>
                <textarea
                  name="question"
                  placeholder="Enter your question"
                  value={form.question}
                  onChange={handleChange}
                  className="form-input w-full rounded-xl border border-[#dde1e3] min-h-[9rem] p-4 placeholder:text-[#6a7681]"
                />
              </label>
            </div>

            {/* Submit button */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="h-10 px-6 rounded-full bg-[#dce8f3] text-sm font-bold hover:bg-[#c1d4ea] disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>

          <div className="">
            <h3 className="text-lg font-bold mb-2">Response</h3>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                p: ({ children }) => (
                  <p className="text-base pt-1 pb-3">{children}</p>
                ),
              }}
            >
              {response}
            </ReactMarkdown>
          </div>
        </main>
      </div>
    </div>
  );
}
