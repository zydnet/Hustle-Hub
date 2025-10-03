'use client';

import { useEffect, useState, useContext } from 'react';
import { RefreshContext } from '@/app/_contexts/refresh';
import { useNotifications } from '@/app/_contexts/notification';
import AddNewJob from './add_new_job';
import { jobApplicationsAPI, handleAPIError } from './apiService';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

// Initialize default apps with unique UUIDs
const initializeDefaultApps = () => [
   {
      id: uuidv4(),
      company: 'Google',
      role: 'Software Engineer Intern',
      deadline: '2025-09-30',
      status: 'Wishlist',
      link: 'https://careers.google.com/jobs/results/',
      notes: 'Summer 2025 internship',
      appliedDate: null,
      interviewDate: null,
   },
   {
      id: uuidv4(),
      company: 'Microsoft',
      role: 'Product Manager',
      deadline: '2025-08-15',
      status: 'Applied',
      link: 'https://careers.microsoft.com/',
      notes: 'Full-time position',
      appliedDate: '2024-12-01',
      interviewDate: null,
   },
   {
      id: uuidv4(),
      company: 'Meta',
      role: 'Frontend Developer',
      deadline: '2025-07-20',
      status: 'Interview',
      link: 'https://www.metacareers.com/',
      notes: 'Technical interview scheduled',
      appliedDate: '2024-11-15',
      interviewDate: '2024-12-15',
   },
];

export default function Status({ hw }) {
   const { addNotification } = useNotifications();
   // 🔥 removed router, refreshCont, setRefreshCont because unused
   useContext(RefreshContext); // keep context alive in case you add features later

   const columns = [
      'Wishlist',
      'Applied',
      'Interview',
      'Offered',
      'Accepted',
      'Rejected',
   ];

   const [applications, setApplications] = useState([]);
   const [editingApp, setEditingApp] = useState(null);

   // Load applications on mount
   useEffect(() => {
      const loadApplications = async () => {
         try {
            const apps = await jobApplicationsAPI.getAll();
            const validApps = Array.isArray(apps)
               ? apps.filter((app) => app && app.status)
               : [];

            if (validApps.length === 0) {
               const defaultApps = initializeDefaultApps();
               setApplications(defaultApps);

               // create apps in backend
               defaultApps.forEach((app) => jobApplicationsAPI.create(app));
            } else {
               setApplications(validApps);
            }
         } catch (error) {
            addNotification(
               handleAPIError(error, 'Failed to load job applications'),
               'error'
            );
         }
      };

      loadApplications();
   }, [addNotification]);
   const handleStatusChange = async (applicationId, newStatus) => {
      try {
         const updatedApp = await jobApplicationsAPI.moveToStatus(
            applicationId,
            newStatus
         );
         setApplications((prev) =>
            prev.map((app) => (app?.id === applicationId ? updatedApp : app))
         );
         addNotification(`Moved to ${newStatus}`, 'success');
      } catch (error) {
         addNotification(
            handleAPIError(error, 'Failed to update status'),
            'error'
         );
      }
   };

   // Add new application
   const addNewApplication = async (newApp) => {
      try {
         const appWithId = {
            id: uuidv4(), // always unique id
            ...newApp,
            appliedDate:
               newApp.status === 'Applied'
                  ? new Date().toISOString().split('T')[0]
                  : null,
            interviewDate:
               newApp.status === 'Interview'
                  ? new Date().toISOString().split('T')[0]
                  : null,
         };
         const createdApp = await jobApplicationsAPI.create(appWithId);
         setApplications((prev) => [...prev, createdApp]);
         addNotification('Job application added successfully!', 'success');
      } catch (error) {
         addNotification(
            handleAPIError(error, 'Failed to add job application'),
            'error'
         );
      }
   };

   // Update application
   const updateApplication = async (applicationId, updatedData) => {
      try {
         const updatedApp = await jobApplicationsAPI.update(applicationId, {
            ...updatedData,
            id: applicationId,
         });
         setApplications((prev) =>
            prev.map((app) => (app?.id === applicationId ? updatedApp : app))
         );
         setEditingApp(null);
         addNotification('Job application updated successfully!', 'success');
      } catch (error) {
         addNotification(
            handleAPIError(error, 'Failed to update job application'),
            'error'
         );
      }
   };

   // Delete application
   const deleteApplication = async (applicationId) => {
      try {
         await jobApplicationsAPI.delete(applicationId);
         setApplications((prev) =>
            prev.filter((app) => app?.id !== applicationId)
         );
         addNotification('Job application deleted', 'info');
      } catch (error) {
         addNotification(
            handleAPIError(error, 'Failed to delete job application'),
            'error'
         );
      }
   };

   const startEditing = (app) => setEditingApp(app);
   const cancelEditing = () => setEditingApp(null);

   return (
      <div
         className="flex flex-1 flex-col overflow-hidden"
         style={{ height: hw }}
      >
         <div className="no-scrollbar flex-1 overflow-auto p-4">
            <AddNewJob
               onAdd={addNewApplication}
               editingApp={editingApp}
               onUpdate={updateApplication}
               onCancel={cancelEditing}
            />

            {/* Kanban Board */}
            <div className="mt-6 flex min-h-[500px] w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
               {columns.map((column) => (
                  <div
                     key={column}
                     className="min-h-[400px] w-72 shrink-0 snap-start rounded-xl border border-gray-200/60 bg-gradient-to-b from-gray-50 to-white p-4 shadow-sm"
                  >
                     <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div
                              className={`h-3 w-3 rounded-full ${column === 'Wishlist'
                                    ? 'bg-yellow-400'
                                    : column === 'Applied'
                                       ? 'bg-blue-400'
                                       : column === 'Interview'
                                          ? 'bg-purple-400'
                                          : column === 'Offered'
                                             ? 'bg-green-400'
                                             : column === 'Accepted'
                                                ? 'bg-emerald-500'
                                                : 'bg-red-400'
                                 }`}
                           ></div>
                           <h3 className="text-lg font-bold text-gray-800">
                              {column}
                           </h3>
                        </div>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                           {
                              applications.filter(
                                 (app) => app?.status === column
                              ).length
                           }
                        </div>
                     </div>

                     <div className="space-y-3">
                        {applications
                           .filter((app) => app?.status === column)
                           .sort((a, b) => {
                              if (a.deadline && b.deadline)
                                 return (
                                    new Date(a.deadline) - new Date(b.deadline)
                                 );
                              if (a.appliedDate && b.appliedDate)
                                 return (
                                    new Date(b.appliedDate) -
                                    new Date(a.appliedDate)
                                 );
                              return 0;
                           })
                           .map((app) => (
                              <div
                                 key={app.id}
                                 className="group relative overflow-hidden rounded-xl border border-gray-200/60 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/50"
                              >
                                 {/* Status indicator */}
                                 <div className="absolute right-3 top-3">
                                    <div
                                       className={`h-2 w-2 rounded-full ${app.status === 'Wishlist'
                                             ? 'bg-yellow-400'
                                             : app.status === 'Applied'
                                                ? 'bg-blue-400'
                                                : app.status === 'Interview'
                                                   ? 'bg-purple-400'
                                                   : app.status === 'Offered'
                                                      ? 'bg-green-400'
                                                      : app.status === 'Accepted'
                                                         ? 'bg-emerald-500'
                                                         : 'bg-red-400'
                                          }`}
                                    ></div>
                                 </div>

                                 {/* Company Logo Placeholder */}
                                 <div className="mb-3 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
                                       {app.company.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                       <div className="truncate text-lg font-bold text-gray-800">
                                          {app.company}
                                       </div>
                                       <div className="truncate text-sm text-gray-600">
                                          {app.role}
                                       </div>
                                    </div>
                                 </div>

                                 {/* Dates Section */}
                                 <div className="mb-3 space-y-1">
                                    {app.deadline && (
                                       <div className="flex items-center gap-2 text-xs text-gray-500">
                                          <svg
                                             className="h-3 w-3"
                                             fill="none"
                                             stroke="currentColor"
                                             viewBox="0 0 24 24"
                                          >
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                             />
                                          </svg>
                                          <span className="font-medium">
                                             Deadline:
                                          </span>
                                          <span className="text-gray-700">
                                             {app.deadline}
                                          </span>
                                       </div>
                                    )}
                                    {app.appliedDate && (
                                       <div className="flex items-center gap-2 text-xs text-blue-600">
                                          <svg
                                             className="h-3 w-3"
                                             fill="none"
                                             stroke="currentColor"
                                             viewBox="0 0 24 24"
                                          >
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                             />
                                          </svg>
                                          <span className="font-medium">
                                             Applied:
                                          </span>
                                          <span className="text-blue-700">
                                             {app.appliedDate}
                                          </span>
                                       </div>
                                    )}
                                    {app.interviewDate && (
                                       <div className="flex items-center gap-2 text-xs text-green-600">
                                          <svg
                                             className="h-3 w-3"
                                             fill="none"
                                             stroke="currentColor"
                                             viewBox="0 0 24 24"
                                          >
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                             />
                                          </svg>
                                          <span className="font-medium">
                                             Interview:
                                          </span>
                                          <span className="text-green-700">
                                             {app.interviewDate}
                                          </span>
                                       </div>
                                    )}
                                 </div>

                                 {/* Notes Section */}
                                 {app.notes && (
                                    <div className="mb-3 rounded-lg bg-gray-50 p-2">
                                       <div className="text-xs italic text-gray-600">
                                          &ldquo;{app.notes}&rdquo;
                                       </div>
                                    </div>
                                 )}

                                 {/* Job Link */}
                                 {app.link && (
                                    <div className="mb-3">
                                       <a
                                          href={app.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-xs text-blue-600 transition-colors hover:text-blue-800"
                                       >
                                          <svg
                                             className="h-3 w-3"
                                             fill="none"
                                             stroke="currentColor"
                                             viewBox="0 0 24 24"
                                          >
                                             <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                             />
                                          </svg>
                                          View Job Posting
                                       </a>
                                    </div>
                                 )}

                                 {/* Action Buttons */}
                                 <div className="flex items-center justify-between">
                                    <div className="flex gap-1">
                                       <button
                                          onClick={() => startEditing(app)}
                                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-all hover:bg-blue-100 hover:shadow-sm"
                                       >
                                          Edit
                                       </button>
                                       <button
                                          onClick={() =>
                                             deleteApplication(app.id)
                                          }
                                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-all hover:bg-red-100 hover:shadow-sm"
                                       >
                                          Delete
                                       </button>
                                    </div>

                                    {/* Status Change Buttons */}
                                    <div className="flex gap-1">
                                       {columns
                                          .filter((col) => col !== app.status)
                                          .slice(0, 2)
                                          .map((newStatus) => (
                                             <button
                                                key={newStatus}
                                                onClick={() =>
                                                   handleStatusChange(
                                                      app.id,
                                                      newStatus
                                                   )
                                                }
                                                className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-all hover:bg-gray-200 hover:shadow-sm"
                                             >
                                                → {newStatus}
                                             </button>
                                          ))}
                                    </div>
                                 </div>

                                 {/* More Actions Dropdown */}
                                 {columns.filter((col) => col !== app.status)
                                    .length > 2 && (
                                       <div className="mt-2 flex justify-end">
                                          <select
                                             onChange={(e) => {
                                                if (e.target.value) {
                                                   handleStatusChange(
                                                      app.id,
                                                      e.target.value
                                                   );
                                                   e.target.value = '';
                                                }
                                             }}
                                             className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                             defaultValue=""
                                          >
                                             <option value="">
                                                More actions...
                                             </option>
                                             {columns
                                                .filter(
                                                   (col) => col !== app.status
                                                )
                                                .slice(2)
                                                .map((status) => (
                                                   <option
                                                      key={status}
                                                      value={status}
                                                   >
                                                      → {status}
                                                   </option>
                                                ))}
                                          </select>
                                       </div>
                                    )}
                              </div>
                           ))}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
