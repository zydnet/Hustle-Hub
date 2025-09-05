'use client';

import { useState, useEffect } from 'react';
import CoverLetterEditor from "@/components/cv/CoverLetterEditor";

export default function ResumeBuilder() {
  const [resume, setResume] = useState({
    name: '',
    email: '',
    headline: '',
    summary: '',
    experience: [{ company: '', role: '', period: '', description: '' }],
    education: [{ institution: '', degree: '', period: '' }],
    skills: '',
  });

  const [applications, setApplications] = useState([]);

  // Load job applications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('job_applications');
    setApplications(saved ? JSON.parse(saved) : []);
  }, []);

  const handleChange = (e, section, idx, field) => {
    if (section) {
      const updated = [...resume[section]];
      updated[idx][field] = e.target.value;
      setResume({ ...resume, [section]: updated });
    } else {
      setResume({ ...resume, [e.target.name]: e.target.value });
    }
  };

  const addEntry = (section) => {
    const blank =
      section === 'experience'
        ? { company: '', role: '', period: '', description: '' }
        : { institution: '', degree: '', period: '' };
    setResume({ ...resume, [section]: [...resume[section], blank] });
  };

  // THEME CLASSES
  const card = "rounded-2xl bg-[#181818] shadow-xl p-6 mb-6 border border-[#353535]";
  const input = "w-full px-3 py-2 mb-2 rounded-lg bg-[#292929] text-white border-none focus:ring-2 focus:ring-blue-700";
  const label = "block text-sm mb-1 text-[#bdbdbd] font-medium";

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-2 py-6 bg-[#111111]">
      <h2 className="text-3xl font-bold text-[#e6e6e6] mb-6">Resume / CV Builder</h2>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        {/* -------- Form -------- */}
        <div className={`flex-1 ${card} text-[#e6e6e6]`}>
          <h3 className="font-semibold text-lg mb-4 text-[#e5e5e5]">Edit Resume</h3>
          <label className={label}>Name:</label>
          <input className={input} name="name" placeholder="Your Name" value={resume.name} onChange={handleChange} />

          <label className={label}>Email:</label>
          <input className={input} name="email" placeholder="Email" value={resume.email} onChange={handleChange} />

          <label className={label}>Headline:</label>
          <input className={input} name="headline" placeholder="Brief Headline" value={resume.headline} onChange={handleChange} />

          <label className={label}>Summary:</label>
          <textarea className={`${input} mb-4`} name="summary" rows={3} placeholder="Summary" value={resume.summary} onChange={handleChange} />

          <h4 className="font-bold mt-6 mb-2 text-[#77e1f1]">Experience</h4>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <input className={input} placeholder="Company" value={exp.company} onChange={e => handleChange(e, 'experience', i, 'company')} />
              <input className={input} placeholder="Role" value={exp.role} onChange={e => handleChange(e, 'experience', i, 'role')} />
              <input className={input} placeholder="Period" value={exp.period} onChange={e => handleChange(e, 'experience', i, 'period')} />
              <textarea className={input} placeholder="Description" value={exp.description} onChange={e => handleChange(e, 'experience', i, 'description')} />
            </div>
          ))}
          <button className="text-[#69b2fa] underline text-sm mb-3" type="button" onClick={() => addEntry('experience')}>
            + Add Experience
          </button>

          <h4 className="font-bold mt-6 mb-2 text-[#77e1f1]">Education</h4>
          {resume.education.map((edu, i) => (
            <div key={i} className="mb-3">
              <input className={input} placeholder="Institution" value={edu.institution} onChange={e => handleChange(e, 'education', i, 'institution')} />
              <input className={input} placeholder="Degree" value={edu.degree} onChange={e => handleChange(e, 'education', i, 'degree')} />
              <input className={input} placeholder="Period" value={edu.period} onChange={e => handleChange(e, 'education', i, 'period')} />
            </div>
          ))}
          <button className="text-[#69b2fa] underline text-sm mb-3" type="button" onClick={() => addEntry('education')}>
            + Add Education
          </button>

          <h4 className="font-bold mt-6 mb-2 text-[#77e1f1]">Skills</h4>
          <textarea className={input} name="skills" placeholder="Skills (comma separated)" value={resume.skills} onChange={handleChange} />
        </div>

        {/* -------- Preview + Cover Letter Editor -------- */}
        <div className={`flex-1 flex flex-col gap-4`}>
          <div className={`${card} text-[#e6e6e6] border-[#363636]`}>
            <h3 className="font-semibold text-lg mb-4 text-[#e5e5e5]">Preview</h3>
            <div>
              <h1 className="text-2xl font-extrabold mb-2 text-[#e6e6e6]">{resume.name}</h1>
              <div className="text-[#66d9ef]">{resume.headline}</div>
              <div className="text-gray-400 text-sm mb-1">{resume.email}</div>
              <div className="mb-4 italic">{resume.summary}</div>

              <h4 className="font-bold mb-2 mt-4 text-[#77e1f1]">Experience</h4>
              {resume.experience.map((exp, i) =>
                exp.company ? (
                  <div key={i} className="mb-2 p-2 rounded bg-[#232323] border border-[#393939]">
                    <span className="font-semibold">{exp.role}</span> @ <span className="italic">{exp.company}</span>
                    <span className="text-gray-400 text-xs"> ({exp.period})</span>
                    <div className="text-sm mt-1">{exp.description}</div>
                  </div>
                ) : null
              )}

              <h4 className="font-bold mb-2 mt-4 text-[#77e1f1]">Education</h4>
              {resume.education.map((edu, i) =>
                edu.institution ? (
                  <div key={i} className="mb-2 p-2 rounded bg-[#232323] border border-[#393939]">
                    <span className="font-semibold">{edu.degree}</span> at <span className="italic">{edu.institution}</span>
                    <span className="text-gray-400 text-xs"> ({edu.period})</span>
                  </div>
                ) : null
              )}

              <h4 className="font-bold mb-2 mt-4 text-[#77e1f1]">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {resume.skills
                  .split(',')
                  .filter((s) => s.trim())
                  .map((s, i) => (
                    <span key={i} className="inline-block bg-[#25292d] text-[#73e6d4] rounded px-3 py-1 text-xs">
                      {s.trim()}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Cover Letter Editor */}
          <CoverLetterEditor applications={applications} />
        </div>
      </div>
    </div>
  );
}
