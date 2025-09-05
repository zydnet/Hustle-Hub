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
         setApplications((prev) => [...prev.filter((a) => a), createdApp]); // filter out any undefined
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
            <div className="mt-4 flex min-h-[400px] w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
               {columns.map((column) => (
                  <div
                     key={column}
                     className="min-h-[300px] w-56 shrink-0 snap-start rounded-lg border-2 border-dashed bg-gray-100 p-3"
                  >
                     <div className="mb-3 text-center text-lg font-bold text-gray-700">
                        {column}
                        <span className="ml-2 text-sm text-gray-500">
                           (
                           {
                              applications.filter(
                                 (app) => app?.status === column
                              ).length
                           }
                           )
                        </span>
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
                                 className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                              >
                                 <div className="text-lg font-bold text-gray-800">
                                    {app.company}
                                 </div>
                                 <div className="mb-2 text-sm text-gray-600">
                                    {app.role}
                                 </div>

                                 {app.deadline && (
                                    <div className="mb-2 text-xs text-gray-500">
                                       Deadline: {app.deadline}
                                    </div>
                                 )}
                                 {app.appliedDate && (
                                    <div className="mb-2 text-xs text-blue-600">
                                       Applied: {app.appliedDate}
                                    </div>
                                 )}
                                 {app.interviewDate && (
                                    <div className="mb-2 text-xs text-green-600">
                                       Interview: {app.interviewDate}
                                    </div>
                                 )}

                                 {app.link && (
                                    <a
                                       href={app.link}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="mb-2 block text-xs text-blue-500 underline"
                                    >
                                       Job Link
                                    </a>
                                 )}

                                 {app.notes && (
                                    <div className="mb-2 text-xs italic text-gray-600">
                                       {app.notes}
                                    </div>
                                 )}

                                 {/* Action buttons */}
                                 <div className="mb-2 flex flex-wrap gap-1">
                                    <button
                                       onClick={() => startEditing(app)}
                                       className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 transition-colors hover:bg-blue-200"
                                    >
                                       Edit
                                    </button>

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
                                             className="rounded bg-gray-200 px-2 py-1 text-xs transition-colors hover:bg-gray-300"
                                          >
                                             → {newStatus}
                                          </button>
                                       ))}
                                 </div>

                                 {/* More actions dropdown */}
                                 <div className="flex items-center justify-between">
                                    <div className="flex gap-1">
                                       <button
                                          onClick={() =>
                                             deleteApplication(app.id)
                                          }
                                          className="text-xs text-red-500 underline hover:text-red-700"
                                       >
                                          Delete
                                       </button>
                                    </div>

                                    {columns.filter((col) => col !== app.status)
                                       .length > 2 && (
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
                                          className="rounded border border-gray-300 px-1 py-0.5 text-xs"
                                          defaultValue=""
                                       >
                                          <option value="">More...</option>
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
                                    )}
                                 </div>
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
