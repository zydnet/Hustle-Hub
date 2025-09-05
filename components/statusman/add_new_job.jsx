'use client';

import { useState, useEffect } from 'react';

export default function AddNewJob({ onAdd, editingApp = null, onUpdate = null, onCancel = null }) {
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.company.trim()) newErrors.company = 'Company name is required';
        if (!formData.role.trim()) newErrors.role = 'Role is required';
        if (formData.link && !isValidUrl(formData.link)) newErrors.link = 'Please enter a valid URL';
        if (formData.deadline && new Date(formData.deadline) < new Date()) newErrors.deadline = 'Deadline cannot be in the past';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try { new URL(string); return true; } 
        catch (_) { return false; }
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
                className="w-full bg-blue-500 hover:bg-blue-600 text-black font-bold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
                + Add New Job Application
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                        {editingApp ? 'Edit Job Application' : 'Add New Job Application'}
                    </h3>
                    <button
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Company + Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${errors.company ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="e.g., Google"
                            />
                            {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="e.g., Software Engineer"
                            />
                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${errors.deadline ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Link</label>
                        <input
                            type="url"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${errors.link ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="https://company.com/careers/job-id"
                        />
                        {errors.link && <p className="text-red-500 text-xs mt-1">{errors.link}</p>}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="Any additional notes about this application..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            {editingApp ? 'Update Application' : 'Add Application'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
