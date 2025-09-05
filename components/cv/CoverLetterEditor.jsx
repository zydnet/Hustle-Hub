'use client';

import { useState } from "react";
// If you want PDF export, you can later add jsPDF or react-pdf

// Pass applications as a prop! (or fetch from global state/context)
export default function CoverLetterEditor({ applications = [] }) {
  const [selectedId, setSelectedId] = useState(
    applications.length ? applications[0].id : ""
  );
  const selectedApp = applications.find(app => app.id === selectedId) || {};

  // Autogenerate starter text
  const starter = selectedApp.company
    ? `Dear Recruiter at ${selectedApp.company},\n\nI am writing to express my strong interest in the ${selectedApp.role || "[Role]"} position. With my background in ${selectedApp.role || "your field"}, I am excited to contribute to your team.\n\n[Insert personal story, achievements, or reasons you fit]\n\nThank you for considering my application.\n\nSincerely,\n[Your Name]`
    : "";

  const [letter, setLetter] = useState(starter);

  // Whenever the selected job changes, refresh the draft
  const handleSelect = (e) => {
    setSelectedId(e.target.value);
    const chosen = applications.find(app => app.id == e.target.value) || {};
    setLetter(
      chosen.company
        ? `Dear Recruiter at ${chosen.company},\n\nI am writing to express my strong interest in the ${chosen.role || "[Role]"} position. With my background in ${chosen.role || "your field"}, I am excited to contribute to your team.\n\n[Insert personal story, achievements, or reasons you fit]\n\nThank you for considering my application.\n\nSincerely,\n[Your Name]`
        : ""
    );
  };

  // Copy the text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(letter);
    alert('Copied to clipboard!');
  };

  // Stub for later: PDF/Download
  const downloadAsPDF = () => {
    alert("PDF download coming soon!\nUse Copy for now, or ask for jsPDF integration.");
    // You can integrate jsPDF or react-pdf for actual export.
  };

  // Theme classes
  const card = "rounded-2xl bg-[#181818] shadow-xl p-6 my-6 border border-[#353535] max-w-2xl w-full mx-auto";
  const input = "w-full px-3 py-2 mb-2 rounded-lg bg-[#292929] text-white border-none focus:ring-2 focus:ring-blue-700";
  const label = "block text-sm mb-1 text-[#bdbdbd] font-medium";

  return (
    <div className="min-h-[80vh] px-2 py-6 bg-[#111111] flex flex-col items-center">
      <div className={card}>
        <h2 className="text-2xl font-bold mb-6 text-[#e5e5e5]">Personalized CV/LTR Builder</h2>
        
        {/* Job select */}
        <label className={label}>Pick a Job Application</label>
        <select
          className={input}
          value={selectedId}
          onChange={handleSelect}
        >
          {applications.map(app => (
            <option value={app.id} key={app.id}>
              {app.company} — {app.role}
            </option>
          ))}
        </select>

        <label className={label}>Edit your cover letter:</label>
        <textarea
          className={`${input} mb-4`}
          rows={14}
          value={letter}
          onChange={e => setLetter(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={copyToClipboard}
            className="bg-gradient-to-br from-[#45aaff] to-[#2b4d8c] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Copy as Text
          </button>
          <button
            onClick={downloadAsPDF}
            className="bg-[#232222] border border-blue-400 text-blue-200 px-4 py-2 rounded-lg shadow hover:bg-[#1e385a] transition"
          >
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
