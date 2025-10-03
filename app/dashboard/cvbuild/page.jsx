'use client';

import { useState, useEffect } from 'react';
import CoverLetterEditor from '@/components/cv/CoverLetterEditor';

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
   // Add: Track saving state for autosave notifications
   const [saved, setSaved] = useState(true);

   // Load job applications from localStorage
   useEffect(() => {
      const savedApps = localStorage.getItem('job_applications');
      setApplications(savedApps ? JSON.parse(savedApps) : []);
   }, []);

   // Load resume from localStorage
   useEffect(() => {
      const savedResume = localStorage.getItem('user_resume');
      if (savedResume) setResume(JSON.parse(savedResume));
   }, []);

   // Autosave resume to localStorage
   useEffect(() => {
      localStorage.setItem('user_resume', JSON.stringify(resume));
      setSaved(false);
      const t = setTimeout(() => setSaved(true), 700);
      return () => clearTimeout(t);
   }, [resume]);

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

   // Remove entry from experience or education
   const removeEntry = (section, idx) => {
      const updated = [...resume[section]];
      updated.splice(idx, 1);
      setResume({ ...resume, [section]: updated });
   };

   // Clear all resume fields
   const clearAll = () => {
      setResume({
         name: '',
         email: '',
         headline: '',
         summary: '',
         experience: [{ company: '', role: '', period: '', description: '' }],
         education: [{ institution: '', degree: '', period: '' }],
         skills: '',
      });
   };

   // Print/Download as PDF
   const handlePrint = () => {
      window.print();
   };

   // THEME CLASSES
   const card =
      'rounded-2xl bg-[#181818] shadow-xl p-6 mb-6 border border-[#353535]';
   const input =
      'w-full px-3 py-2 mb-2 rounded-lg bg-[#292929] text-white border-none focus:ring-2 focus:ring-blue-700';
   const label = 'block text-sm mb-1 text-[#bdbdbd] font-medium';

   return (
      <div className="flex min-h-[80vh] flex-col items-center bg-[#111111] px-2 py-6 print:bg-white print:text-black">
         <h2 className="mb-6 text-3xl font-bold text-[#e6e6e6] print:text-black">
            Resume / CV Builder
         </h2>
         <div className="mb-4 flex flex-wrap gap-4">
            <button
               className="rounded bg-[#232323] px-4 py-2 text-sm text-white shadow hover:bg-[#282828]"
               onClick={clearAll}
               type="button"
            >
               Clear All
            </button>
            <button
               className="rounded bg-[#228be6] px-4 py-2 text-sm text-white shadow hover:bg-[#1c67b2] print:hidden"
               onClick={handlePrint}
               type="button"
            >
               Download / Print
            </button>
            <span className="ml-3 text-xs text-[#8fd7a7]">
               {saved ? 'Saved!' : 'Saving...'}
            </span>
         </div>
         <div className="flex w-full max-w-5xl flex-col gap-8 md:flex-row print:flex-col print:gap-0">
            {/* -------- Form -------- */}
            <div className={`flex-1 ${card} text-[#e6e6e6] print:shadow-none print:border-0 print:bg-white print:text-black`}>
               <h3 className="mb-4 text-lg font-semibold text-[#e5e5e5] print:text-black">
                  Edit Resume
               </h3>
               <label className={label}>Name:</label>
               <input
                  className={input}
                  name="name"
                  placeholder="Your Name"
                  value={resume.name}
                  onChange={handleChange}
               />

               <label className={label}>Email:</label>
               <input
                  className={input}
                  name="email"
                  placeholder="Email"
                  value={resume.email}
                  onChange={handleChange}
               />

               <label className={label}>Headline:</label>
               <input
                  className={input}
                  name="headline"
                  placeholder="Brief Headline"
                  value={resume.headline}
                  onChange={handleChange}
               />

               <label className={label}>Summary:</label>
               <textarea
                  className={`${input} mb-4`}
                  name="summary"
                  rows={3}
                  placeholder="Summary"
                  value={resume.summary}
                  onChange={handleChange}
               />

               <h4 className="mb-2 mt-6 font-bold text-[#77e1f1] print:text-black">
                  Experience
               </h4>
               {resume.experience.map((exp, i) => (
                  <div key={i} className="mb-3 flex gap-2 items-start">
                     <div className="flex-grow">
                        <input
                           className={input}
                           placeholder="Company"
                           value={exp.company}
                           onChange={(e) =>
                              handleChange(e, 'experience', i, 'company')
                           }
                        />
                        <input
                           className={input}
                           placeholder="Role"
                           value={exp.role}
                           onChange={(e) =>
                              handleChange(e, 'experience', i, 'role')
                           }
                        />
                        <input
                           className={input}
                           placeholder="Period"
                           value={exp.period}
                           onChange={(e) =>
                              handleChange(e, 'experience', i, 'period')
                           }
                        />
                        <textarea
                           className={input}
                           placeholder="Description"
                           value={exp.description}
                           onChange={(e) =>
                              handleChange(e, 'experience', i, 'description')
                           }
                        />
                     </div>
                     {resume.experience.length > 1 && (
                        <button
                           className="ml-2 mt-2 h-8 w-8 rounded-full bg-[#232323] text-[#e57373] hover:bg-[#400505] print:hidden"
                           type="button"
                           title="Remove"
                           onClick={() => removeEntry('experience', i)}
                        >
                           &times;
                        </button>
                     )}
                  </div>
               ))}
               <button
                  className="mb-3 text-sm text-[#69b2fa] underline"
                  type="button"
                  onClick={() => addEntry('experience')}
               >
                  + Add Experience
               </button>

               <h4 className="mb-2 mt-6 font-bold text-[#77e1f1] print:text-black">
                  Education
               </h4>
               {resume.education.map((edu, i) => (
                  <div key={i} className="mb-3 flex gap-2 items-start">
                     <div className="flex-grow">
                        <input
                           className={input}
                           placeholder="Institution"
                           value={edu.institution}
                           onChange={(e) =>
                              handleChange(e, 'education', i, 'institution')
                           }
                        />
                        <input
                           className={input}
                           placeholder="Degree"
                           value={edu.degree}
                           onChange={(e) =>
                              handleChange(e, 'education', i, 'degree')
                           }
                        />
                        <input
                           className={input}
                           placeholder="Period"
                           value={edu.period}
                           onChange={(e) =>
                              handleChange(e, 'education', i, 'period')
                           }
                        />
                     </div>
                     {resume.education.length > 1 && (
                        <button
                           className="ml-2 mt-2 h-8 w-8 rounded-full bg-[#232323] text-[#e57373] hover:bg-[#400505] print:hidden"
                           type="button"
                           title="Remove"
                           onClick={() => removeEntry('education', i)}
                        >
                           &times;
                        </button>
                     )}
                  </div>
               ))}
               <button
                  className="mb-3 text-sm text-[#69b2fa] underline"
                  type="button"
                  onClick={() => addEntry('education')}
               >
                  + Add Education
               </button>

               <h4 className="mb-2 mt-6 font-bold text-[#77e1f1] print:text-black">
                  Skills
               </h4>
               <textarea
                  className={input}
                  name="skills"
                  placeholder="Skills (comma separated)"
                  value={resume.skills}
                  onChange={handleChange}
               />
            </div>

            {/* -------- Preview + Cover Letter Editor -------- */}
            <div className={`flex flex-1 flex-col gap-4`}>
               <div className={`${card} border-[#363636] text-[#e6e6e6] print:shadow-none print:border-0 print:bg-white print:text-black`}>
                  <h3 className="mb-4 text-lg font-semibold text-[#e5e5e5] print:text-black">
                     Preview
                  </h3>
                  <div>
                     <h1 className="mb-2 text-2xl font-extrabold text-[#e6e6e6] print:text-black">
                        {resume.name}
                     </h1>
                     <div className="text-[#66d9ef] print:text-black">{resume.headline}</div>
                     <div className="mb-1 text-sm text-gray-400 print:text-black">
                        {resume.email}
                     </div>
                     <div className="mb-4 italic print:text-black">{resume.summary}</div>

                     <h4 className="mb-2 mt-4 font-bold text-[#77e1f1] print:text-black">
                        Experience
                     </h4>
                     {resume.experience.map((exp, i) =>
                        exp.company ? (
                           <div
                              key={i}
                              className="mb-2 rounded border border-[#393939] bg-[#232323] p-2 print:bg-white print:border-black"
                           >
                              <span className="font-semibold print:text-black">{exp.role}</span>{' '}
                              @ <span className="italic print:text-black">{exp.company}</span>
                              <span className="text-xs text-gray-400 print:text-black">
                                 {' '}
                                 ({exp.period})
                              </span>
                              <div className="mt-1 text-sm print:text-black">
                                 {exp.description}
                              </div>
                           </div>
                        ) : null
                     )}

                     <h4 className="mb-2 mt-4 font-bold text-[#77e1f1] print:text-black">
                        Education
                     </h4>
                     {resume.education.map((edu, i) =>
                        edu.institution ? (
                           <div
                              key={i}
                              className="mb-2 rounded border border-[#393939] bg-[#232323] p-2 print:bg-white print:border-black"
                           >
                              <span className="font-semibold print:text-black">
                                 {edu.degree}
                              </span>{' '}
                              at{' '}
                              <span className="italic print:text-black">{edu.institution}</span>
                              <span className="text-xs text-gray-400 print:text-black">
                                 {' '}
                                 ({edu.period})
                              </span>
                           </div>
                        ) : null
                     )}

                     <h4 className="mb-2 mt-4 font-bold text-[#77e1f1] print:text-black">
                        Skills
                     </h4>
                     <div className="flex flex-wrap gap-2 print:text-black">
                        {resume.skills
                           .split(',')
                           .filter((s) => s.trim())
                           .map((s, i) => (
                              <span
                                 key={i}
                                 className="inline-block rounded bg-[#25292d] px-3 py-1 text-xs text-[#73e6d4] print:bg-white print:text-black print:border print:border-black"
                              >
                                 {s.trim()}
                              </span>
                           ))}
                     </div>
                  </div>
               </div>

               {/* Cover Letter Editor */}
               <div className="print:hidden">
                  <CoverLetterEditor applications={applications} />
               </div>
            </div>
         </div>
      </div>
   );
}