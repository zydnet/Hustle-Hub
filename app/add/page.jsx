'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddResumeOrJobPreferences() {
   const router = useRouter();

   const [form, setForm] = useState({
      fullName: '',
      email: '',
      summary: '',
      preferredRoles: '',
      preferredCompanies: '',
      preferredLocations: '',
      skills: '',
      expectedSalary: '',
      linkedIn: '',
      github: '',
      website: '',
   });

   const [submitted, setSubmitted] = useState(false);

   const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      // Save to localStorage (as JSON)
      localStorage.setItem('hustlehub_profile', JSON.stringify(form));

      setSubmitted(true);

      // Redirect after short delay
      setTimeout(() => {
         router.push('/dashboard/home');
      }, 1000);
   };

   const inputClass =
      'w-full px-3 py-2 mb-3 rounded-lg bg-[#232222] text-white border-none focus:ring-2 focus:ring-blue-700 placeholder-gray-400';
   const labelClass = 'block text-sm mb-1 text-[#bdbdbd] font-medium';
   const buttonClass =
      'w-full mt-3 rounded-lg bg-blue-700 py-3 font-bold text-white hover:bg-blue-600 transition';
   const selectClass =
      'w-full px-3 py-2 mb-3 rounded-lg bg-[#232222] text-white border-none focus:ring-2 focus:ring-blue-700';

   return (
      <div className="flex min-h-screen items-center justify-center bg-[#181818] px-2 py-6">
         <div className="w-full max-w-xl">
            <form
               onSubmit={handleSubmit}
               className="max-h-[85vh] overflow-y-auto rounded-2xl bg-[#181818] p-8 text-[#e6e6e6] shadow-xl max-sm:p-4"
               autoComplete="off"
            >
               <h2 className="mb-6 text-center text-2xl font-bold text-[#77e1f1]">
                  Add Resume & Job Preferences
               </h2>

               <label className={labelClass}>Full Name</label>
               <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass}
                  required
               />

               <label className={labelClass}>Email</label>
               <input
                  className={inputClass}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
               />

               <label className={labelClass}>Professional Summary</label>
               <textarea
                  className={`${inputClass} resize-none`}
                  name="summary"
                  rows={3}
                  value={form.summary}
                  onChange={handleChange}
                  placeholder="Brief summary about yourself"
               />

               <label className={labelClass}>Skills (comma separated)</label>
               <input
                  className={inputClass}
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, SQL"
               />

               <label className={labelClass}>Preferred Roles</label>
               <input
                  className={inputClass}
                  name="preferredRoles"
                  value={form.preferredRoles}
                  onChange={handleChange}
                  placeholder="Frontend Developer, Data Analyst"
               />

               <label className={labelClass}>Preferred Companies</label>
               <input
                  className={inputClass}
                  name="preferredCompanies"
                  value={form.preferredCompanies}
                  onChange={handleChange}
                  placeholder="Google, Microsoft"
               />

               <label className={labelClass}>Preferred Locations</label>
               <input
                  className={inputClass}
                  name="preferredLocations"
                  value={form.preferredLocations}
                  onChange={handleChange}
                  placeholder="Bangalore, Remote"
               />

               <label className={labelClass}>Expected Salary</label>
               <select
                  className={selectClass}
                  name="expectedSalary"
                  value={form.expectedSalary}
                  onChange={handleChange}
               >
                  <option value="">Select salary range</option>
                  <option value="3-5 LPA">3-5 LPA</option>
                  <option value="5-10 LPA">5-10 LPA</option>
                  <option value="10-20 LPA">10-20 LPA</option>
                  <option value="20+ LPA">20+ LPA</option>
               </select>

               <label className={labelClass}>LinkedIn</label>
               <input
                  className={inputClass}
                  name="linkedIn"
                  value={form.linkedIn}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
               />

               <label className={labelClass}>Github</label>
               <input
                  className={inputClass}
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
               />

               <label className={labelClass}>Website/Portfolio</label>
               <input
                  className={inputClass}
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
               />

               <button type="submit" className={buttonClass}>
                  Save Details
               </button>

               {submitted && (
                  <div className="mt-4 text-center font-bold text-green-400">
                     ✅ Details saved locally! Redirecting...
                  </div>
               )}
            </form>
         </div>
      </div>
   );
}
