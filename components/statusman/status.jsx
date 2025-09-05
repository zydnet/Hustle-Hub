'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { refreshCont, setRefreshCont } = useContext(RefreshContext);

  const columns = ['Wishlist', 'Applied', 'Interview', 'Offered', 'Accepted', 'Rejected'];

  const [applications, setApplications] = useState([]);
  const [editingApp, setEditingApp] = useState(null);

  // Load applications on mount
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const apps = await jobApplicationsAPI.getAll();
        const validApps = Array.isArray(apps) ? apps.filter(app => app && app.status) : [];

        if (validApps.length === 0) {
          const defaultApps = initializeDefaultApps();
          setApplications(defaultApps);

          // create apps in backend
          defaultApps.forEach(app => jobApplicationsAPI.create(app));
        } else {
          setApplications(validApps);
        }
      } catch (error) {
        addNotification(handleAPIError(error, 'Failed to load job applications'), 'error');
      }
    };

    loadApplications();
  }, []);

  // Change status of a job application
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const updatedApp = await jobApplicationsAPI.moveToStatus(applicationId, newStatus);
      setApplications(prev =>
        prev.map(app => (app?.id === applicationId ? updatedApp : app))
      );
      addNotification(`Moved to ${newStatus}`, 'success');
    } catch (error) {
      addNotification(handleAPIError(error, 'Failed to update status'), 'error');
    }
  };

  // Add new application
  const addNewApplication = async (newApp) => {
    try {
      const appWithId = {
        id: uuidv4(), // always unique id
        ...newApp,
        appliedDate: newApp.status === 'Applied' ? new Date().toISOString().split('T')[0] : null,
        interviewDate: newApp.status === 'Interview' ? new Date().toISOString().split('T')[0] : null,
      };
      const createdApp = await jobApplicationsAPI.create(appWithId);
      setApplications(prev => [...prev.filter(a => a), createdApp]); // filter out any undefined
      addNotification('Job application added successfully!', 'success');
    } catch (error) {
      addNotification(handleAPIError(error, 'Failed to add job application'), 'error');
    }
  };

  // Update application
  const updateApplication = async (applicationId, updatedData) => {
    try {
      const updatedApp = await jobApplicationsAPI.update(applicationId, {
        ...updatedData,
        id: applicationId,
      });
      setApplications(prev =>
        prev.map(app => (app?.id === applicationId ? updatedApp : app))
      );
      setEditingApp(null);
      addNotification('Job application updated successfully!', 'success');
    } catch (error) {
      addNotification(handleAPIError(error, 'Failed to update job application'), 'error');
    }
  };

  // Delete application
  const deleteApplication = async (applicationId) => {
    try {
      await jobApplicationsAPI.delete(applicationId);
      setApplications(prev => prev.filter(app => app?.id !== applicationId));
      addNotification('Job application deleted', 'info');
    } catch (error) {
      addNotification(handleAPIError(error, 'Failed to delete job application'), 'error');
    }
  };

  const startEditing = (app) => setEditingApp(app);
  const cancelEditing = () => setEditingApp(null);

  return (
    <div className="flex flex-1 flex-col overflow-hidden" style={{ height: hw }}>
      <div className="no-scrollbar flex-1 overflow-auto p-4">
        <AddNewJob
          onAdd={addNewApplication}
          editingApp={editingApp}
          onUpdate={updateApplication}
          onCancel={cancelEditing}
        />

        {/* Kanban Board */}
        <div className="flex gap-4 mt-4 min-h-[400px] overflow-x-auto pb-4 w-full snap-x snap-mandatory">
          {columns.map((column) => (
            <div
              key={column}
              className="flex-shrink-0 w-56 bg-gray-100 rounded-lg p-3 min-h-[300px] snap-start border-2 border-dashed"
            >
              <div className="font-bold text-lg mb-3 text-center text-gray-700">
                {column}
                <span className="ml-2 text-sm text-gray-500">
                  ({applications.filter(app => app?.status === column).length})
                </span>
              </div>

              <div className="space-y-3">
                {applications
                  .filter(app => app?.status === column)
                  .sort((a, b) => {
                    if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline);
                    if (a.appliedDate && b.appliedDate) return new Date(b.appliedDate) - new Date(a.appliedDate);
                    return 0;
                  })
                  .map((app) => (
                    <div key={app.id} className="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
                      <div className="font-bold text-lg text-gray-800">{app.company}</div>
                      <div className="text-gray-600 text-sm mb-2">{app.role}</div>

                      {app.deadline && <div className="text-xs text-gray-500 mb-2">Deadline: {app.deadline}</div>}
                      {app.appliedDate && <div className="text-xs text-blue-600 mb-2">Applied: {app.appliedDate}</div>}
                      {app.interviewDate && <div className="text-xs text-green-600 mb-2">Interview: {app.interviewDate}</div>}

                      {app.link && (
                        <a
                          href={app.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline text-xs block mb-2"
                        >
                          Job Link
                        </a>
                      )}

                      {app.notes && <div className="text-xs text-gray-600 mb-2 italic">{app.notes}</div>}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        <button
                          onClick={() => startEditing(app)}
                          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors"
                        >
                          Edit
                        </button>

                        {columns
                          .filter(col => col !== app.status)
                          .slice(0, 2)
                          .map((newStatus) => (
                            <button
                              key={newStatus}
                              onClick={() => handleStatusChange(app.id, newStatus)}
                              className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
                            >
                              → {newStatus}
                            </button>
                          ))}
                      </div>

                      {/* More actions dropdown */}
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          <button
                            onClick={() => deleteApplication(app.id)}
                            className="text-xs text-red-500 hover:text-red-700 underline"
                          >
                            Delete
                          </button>
                        </div>

                        {columns.filter(col => col !== app.status).length > 2 && (
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleStatusChange(app.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="text-xs border border-gray-300 rounded px-1 py-0.5"
                            defaultValue=""
                          >
                            <option value="">More...</option>
                            {columns
                              .filter(col => col !== app.status)
                              .slice(2)
                              .map((status) => (
                                <option key={status} value={status}>
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
