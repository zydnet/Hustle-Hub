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
      } else {
         const newJob = { ...formData, id: Date.now() };
         onAdd(newJob);
      }
      resetForm();
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
            className="w-full rounded-lg bg-blue-500 px-4 py-3 font-bold text-black shadow-md transition-colors hover:bg-blue-600 hover:shadow-lg"
         >
            + Add New Job Application
         </button>
      );
   }

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
         <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
               <h3 className="text-xl font-bold text-gray-800">
                  {editingApp
                     ? 'Edit Job Application'
                     : 'Add New Job Application'}
               </h3>
               <button
                  onClick={handleCancel}
                  className="text-2xl text-gray-500 hover:text-gray-700"
               >
                  ×
               </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               {/* Company + Role */}
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                     <label className="mb-1 block text-sm font-medium text-gray-700">
                        Company *
                     </label>
                     <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={`w-full rounded-md border px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.company ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., Google"
                     />
                     {errors.company && (
                        <p className="mt-1 text-xs text-red-500">
                           {errors.company}
                        </p>
                     )}
                  </div>

                  <div>
                     <label className="mb-1 block text-sm font-medium text-gray-700">
                        Role *
                     </label>
                     <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`w-full rounded-md border px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., Software Engineer"
                     />
                     {errors.role && (
                        <p className="mt-1 text-xs text-red-500">
                           {errors.role}
                        </p>
                     )}
                  </div>

                  <div>
                     <label className="mb-1 block text-sm font-medium text-gray-700">
                        Deadline
                     </label>
                     <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className={`w-full rounded-md border px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.deadline ? 'border-red-500' : 'border-gray-300'}`}
                     />
                     {errors.deadline && (
                        <p className="mt-1 text-xs text-red-500">
                           {errors.deadline}
                        </p>
                     )}
                  </div>

                  <div>
                     <label className="mb-1 block text-sm font-medium text-gray-700">
                        Status
                     </label>
                     <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                     Job Link
                  </label>
                  <input
                     type="url"
                     name="link"
                     value={formData.link}
                     onChange={handleChange}
                     className={`w-full rounded-md border px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.link ? 'border-red-500' : 'border-gray-300'}`}
                     placeholder="https://company.com/careers/job-id"
                  />
                  {errors.link && (
                     <p className="mt-1 text-xs text-red-500">{errors.link}</p>
                  )}
               </div>

               {/* Notes */}
               <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                     Notes
                  </label>
                  <textarea
                     name="notes"
                     value={formData.notes}
                     onChange={handleChange}
                     rows={3}
                     className="w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="Any additional notes about this application..."
                  />
               </div>

               {/* Buttons */}
               <div className="flex gap-3 pt-4">
                  <button
                     type="submit"
                     className="flex-1 rounded-lg bg-green-500 px-4 py-2 font-bold text-white transition-colors hover:bg-green-600"
                  >
                     {editingApp ? 'Update Application' : 'Add Application'}
                  </button>
                  <button
                     type="button"
                     onClick={handleCancel}
                     className="flex-1 rounded-lg bg-gray-500 px-4 py-2 font-bold text-white transition-colors hover:bg-gray-600"
                  >
                     Cancel
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
