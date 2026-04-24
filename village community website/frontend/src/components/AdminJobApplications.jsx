import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Phone, Mail, Calendar } from 'lucide-react';
import { API_URL } from '../services/config.js';

const AdminJobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('bv_token');
        const response = await axios.get(`${API_URL}/api/admin/job-applications`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <div className="p-12 text-center text-white font-heading">Loading applications...</div>;

  return (
    <div className="p-8 bg-dark-slate min-h-screen text-white">
      <h2 className="text-4xl font-bold mb-10 font-heading">Job <span className="text-futuristic-blue">Applications</span></h2>
      
      <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/10 text-gray-400 text-xs uppercase tracking-[0.2em]">
            <tr>
              <th className="p-6 font-black">Applicant</th>
              <th className="p-6 font-black">Job Position</th>
              <th className="p-6 font-black">Contact Details</th>
              <th className="p-6 font-black">Submission Date</th>
              <th className="p-6 font-black text-right">Resume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-white/5 transition-all duration-300">
                <td className="p-6">
                  <div className="font-bold text-lg text-white group-hover:text-futuristic-blue transition-colors">{app.fullName}</div>
                  <div className="text-sm text-gray-500 mt-2 line-clamp-1 italic max-w-xs">"{app.message || 'No cover message'}"</div>
                </td>
                <td className="p-6">
                  <span className="px-4 py-1.5 bg-futuristic-blue/10 text-futuristic-blue border border-futuristic-blue/20 rounded-full text-xs font-black uppercase tracking-wider">
                    {app.jobTitle}
                  </span>
                </td>
                <td className="p-6">
                  <div className="space-y-1.5 text-sm text-gray-300">
                    <div className="flex items-center gap-2"><Phone size={14} className="text-natural-green" /> {app.phone}</div>
                    {app.email && <div className="flex items-center gap-2"><Mail size={14} className="text-natural-green" /> {app.email}</div>}
                  </div>
                </td>
                <td className="p-6 text-sm text-gray-400 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-600" />
                    {new Date(app.appliedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                </td>
                <td className="p-6 text-right">
                  {app.resumePath ? (
                    <a 
                      href={`${API_URL}${app.resumePath.replace(/\\/g, '/')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-natural-green text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all text-sm font-bold shadow-lg shadow-natural-green/20 hover:shadow-natural-green/40 active:scale-95"
                    >
                      <FileText size={16} /> View
                    </a>
                  ) : (
                    <span className="text-xs text-gray-700 font-bold italic">No File</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && (
          <div className="p-20 text-center">
            <FileText className="mx-auto text-gray-800 w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold text-gray-600">No applications yet.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobApplications;
