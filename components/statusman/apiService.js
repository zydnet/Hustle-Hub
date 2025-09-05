// API Service for Job Applications
// This file contains functions that can be easily swapped between localStorage and API calls

// eslint-disable-next-line no-unused-vars
const API_BASE_URL =
   process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// For now, we'll use localStorage, but this structure makes it easy to switch to API calls
export const jobApplicationsAPI = {
   // Get all job applications
   async getAll() {
      try {
         // TODO: Replace with actual API call
         // const response = await fetch(`${API_BASE_URL}/job-applications`);
         // return await response.json();

         // Current localStorage implementation
         const saved = localStorage.getItem('job_applications');
         return saved ? JSON.parse(saved) : [];
      } catch (error) {
         console.error('Error fetching job applications:', error);
         throw error;
      }
   },

   // Create a new job application
   async create(application) {
      try {
         // TODO: Replace with actual API call
         // const response = await fetch(`${API_BASE_URL}/job-applications`, {
         //    method: 'POST',
         //    headers: { 'Content-Type': 'application/json' },
         //    body: JSON.stringify(application)
         // });
         // return await response.json();

         // Current localStorage implementation
         const existing = JSON.parse(
            localStorage.getItem('job_applications') || '[]'
         );
         const newApp = { ...application, id: Date.now() };
         const updated = [...existing, newApp];
         localStorage.setItem('job_applications', JSON.stringify(updated));
         return newApp;
      } catch (error) {
         console.error('Error creating job application:', error);
         throw error;
      }
   },

   // Update an existing job application
   async update(id, updates) {
      try {
         // TODO: Replace with actual API call
         // const response = await fetch(`${API_BASE_URL}/job-applications/${id}`, {
         //    method: 'PUT',
         //    headers: { 'Content-Type': 'application/json' },
         //    body: JSON.stringify(updates)
         // });
         // return await response.json();

         // Current localStorage implementation
         const existing = JSON.parse(
            localStorage.getItem('job_applications') || '[]'
         );
         const updated = existing.map((app) =>
            app.id === id ? { ...app, ...updates } : app
         );
         localStorage.setItem('job_applications', JSON.stringify(updated));
         return updated.find((app) => app.id === id);
      } catch (error) {
         console.error('Error updating job application:', error);
         throw error;
      }
   },

   // Delete a job application
   async delete(id) {
      try {
         // TODO: Replace with actual API call
         // const response = await fetch(`${API_BASE_URL}/job-applications/${id}`, {
         //    method: 'DELETE'
         // });
         // return response.ok;

         // Current localStorage implementation
         const existing = JSON.parse(
            localStorage.getItem('job_applications') || '[]'
         );
         const updated = existing.filter((app) => app.id !== id);
         localStorage.setItem('job_applications', JSON.stringify(updated));
         return true;
      } catch (error) {
         console.error('Error deleting job application:', error);
         throw error;
      }
   },

   // Move application to different status
   async moveToStatus(id, newStatus) {
      try {
         // TODO: Replace with actual API call
         // const response = await fetch(`${API_BASE_URL}/job-applications/${id}/status`, {
         //    method: 'PATCH',
         //    headers: { 'Content-Type': 'application/json' },
         //    body: JSON.stringify({ status: newStatus })
         // });
         // return await response.json();

         // Current localStorage implementation
         const existing = JSON.parse(
            localStorage.getItem('job_applications') || '[]'
         );
         const updated = existing.map((app) => {
            if (app.id === id) {
               const now = new Date().toISOString().split('T')[0];
               return {
                  ...app,
                  status: newStatus,
                  appliedDate:
                     newStatus === 'Applied' && !app.appliedDate
                        ? now
                        : app.appliedDate,
                  interviewDate:
                     newStatus === 'Interview' && !app.interviewDate
                        ? now
                        : app.interviewDate,
               };
            }
            return app;
         });
         localStorage.setItem('job_applications', JSON.stringify(updated));
         return updated.find((app) => app.id === id);
      } catch (error) {
         console.error('Error moving job application:', error);
         throw error;
      }
   },
};

// Helper function to check if we're using API or localStorage
export const isUsingAPI = () => {
   return process.env.NEXT_PUBLIC_USE_API === 'true';
};

// Error handling utility
export const handleAPIError = (
   error,
   fallbackMessage = 'An error occurred'
) => {
   console.error('API Error:', error);

   if (error.response) {
      // Server responded with error status
      return `Server error: ${error.response.status} - ${error.response.data?.message || fallbackMessage}`;
   } else if (error.request) {
      // Request was made but no response received
      return 'Network error: Please check your connection';
   } else {
      // Something else happened
      return error.message || fallbackMessage;
   }
};
