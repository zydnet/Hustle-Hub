'use client';

import { useState, useEffect } from 'react';

export default function AddNewJob({
   onAdd,
   editingApp = null,
   onUpdate = null,
   onCancel = null,
}) {
   const [isOpen, setIsOpen] = useState(false);
   const [formData, setFormData] = useState({
      company: '',
      role: '',
      deadline: '',
      status: 'Wishlist',
      link: '',
      notes: '',
   });
   const [errors, setErrors] = useState({});

   // Initialize form data when editing
   useEffect(() => {
      if (editingApp) {
         setFormData({
            company: editingApp.company || '',
            role: editingApp.role || '',
            deadline: editingApp.deadline || '',
            status: editingApp.status || 'Wishlist',
            link: editingApp.link || '',
            notes: editingApp.notes || '',
         });
         setIsOpen(true);
      } else {
         setIsOpen(false);
      }
   }, [editingApp]);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));

      if (errors[name]) {
         setErrors((prev) => ({
            ...prev,
            [name]: '',
         }));
      }
   };

   const validateForm = () => {
      const newErrors = {};

      if (!formData.company.trim())
         newErrors.company = 'Company name is required';
      if (!formData.role.trim()) newErrors.role = 'Role is required';
      if (formData.link && !isValidUrl(formData.link))
         newErrors.link = 'Please enter a valid URL';
      if (formData.deadline && new Date(formData.deadline) < new Date())
         newErrors.deadline = 'Deadline cannot be in the past';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const isValidUrl = (string) => {
      try {
         new URL(string);
         return true;
      } catch (_) {
         return false;
      }
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      if (editingApp && onUpdate) {
         onUpdate(editingApp.id, formData);
         // Close the form after successful update
         setIsOpen(false);
      } else {
         onAdd(formData);
         resetForm();
      }
   };

   const resetForm = () => {
      setFormData({
         company: '',
         role: '',
         deadline: '',
         status: 'Wishlist',
         link: '',
         notes: '',
      });
      setErrors({});
      setIsOpen(false);
   };

   const handleCancel = () => {
      resetForm();
      if (onCancel) onCancel();
   };

   if (!isOpen && !editingApp) {
      return (
         <button
            onClick={() => setIsOpen(true)}
            className="group w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl hover:shadow-blue-500/25"
         >
            <div className="flex items-center justify-center gap-2">
               <svg
                  className="size-5 transition-transform group-hover:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M12 4v16m8-8H4"
                  />
               </svg>
               Add New Job Application
            </div>
         </button>
      );
   }

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
         <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white">
                     {editingApp ? '✏️' : '➕'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                     {editingApp
                        ? 'Edit Job Application'
                        : 'Add New Job Application'}
                  </h3>
               </div>
               <button
                  onClick={handleCancel}
                  className="flex size-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
               >
                  <svg
                     className="size-4"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                     />
                  </svg>
               </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               {/* Company + Role */}
               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                     <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Company *
                     </label>
                     <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={`w-full rounded-xl border px-4 py-3 text-gray-800 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.company ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'}`}
                        placeholder="e.g., Google"
                     />
                     {errors.company && (
                        <p className="mt-2 text-sm text-red-500">
                           {errors.company}
                        </p>
                     )}
                  </div>

                  <div>
                     <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Role *
                     </label>
                     <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`w-full rounded-xl border px-4 py-3 text-gray-800 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.role ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'}`}
                        placeholder="e.g., Software Engineer"
                     />
                     {errors.role && (
                        <p className="mt-2 text-sm text-red-500">
                           {errors.role}
                        </p>
                     )}
                  </div>

                  <div>
                     <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Deadline
                     </label>
                     <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className={`w-full rounded-xl border px-4 py-3 text-gray-800 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.deadline ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'}`}
                     />
                     {errors.deadline && (
                        <p className="mt-2 text-sm text-red-500">
                           {errors.deadline}
                        </p>
                     )}
                  </div>

                  <div>
                     <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Status
                     </label>
                     <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     >
                        <option value="Wishlist">Wishlist</option>
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offered">Offered</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                     </select>
                  </div>
               </div>

               {/* Link */}
               <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                     Job Link
                  </label>
                  <input
                     type="url"
                     name="link"
                     value={formData.link}
                     onChange={handleChange}
                     className={`w-full rounded-xl border px-4 py-3 text-gray-800 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.link ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'}`}
                     placeholder="https://company.com/careers/job-id"
                  />
                  {errors.link && (
                     <p className="mt-2 text-sm text-red-500">{errors.link}</p>
                  )}
               </div>

               {/* Notes */}
               <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                     Notes
                  </label>
                  <textarea
                     name="notes"
                     value={formData.notes}
                     onChange={handleChange}
                     rows={3}
                     className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="Any additional notes about this application..."
                  />
               </div>

               {/* Buttons */}
               <div className="flex gap-4 pt-6">
                  <button
                     type="submit"
                     className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:from-green-600 hover:to-emerald-700 hover:shadow-xl"
                  >
                     {editingApp ? 'Update Application' : 'Add Application'}
                  </button>
                  <button
                     type="button"
                     onClick={handleCancel}
                     className="flex-1 rounded-xl bg-gray-100 px-6 py-3 font-bold text-gray-700 transition-all hover:bg-gray-200 hover:shadow-md"
                  >
                     Cancel
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
