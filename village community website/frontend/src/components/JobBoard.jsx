import React, { useState, useMemo } from 'react';
import { MapPin, Clock, X, Send, Phone, FileText, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../services/config.js';

const JobBoard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]); // Track job IDs user applied for
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: '',
    resume: null
  });
  const [errors, setErrors] = useState({});

  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Full-time', 'Part-time', 'Contract'];

  const jobs = [
    { id: 1, title: "Farm Worker", type: "Full-time", pay: "₹500/day", location: "South Field", urgent: true },
    { id: 2, title: "Milk Delivery Person", type: "Part-time", pay: "₹3000/mo", location: "Village Center" },
    { id: 3, title: "Shop Assistant", type: "Full-time", pay: "₹8000/mo", location: "Main Market" },
    { id: 4, title: "Electrician", type: "Contract", pay: "₹400/visit", location: "Village Wide", urgent: true },
    { id: 5, title: "Plumber", type: "Contract", pay: "₹350/visit", location: "Village Wide" },
    { id: 6, title: "Tailor", type: "Part-time", pay: "₹200/dress", location: "Market Street" },
    { id: 7, title: "Construction Worker", type: "Full-time", pay: "₹600/day", location: "New Site" },
    { id: 8, title: "Driver", type: "Full-time", pay: "₹12000/mo", location: "Main Road", urgent: true },
    { id: 10, title: "Anganwadi Helper", type: "Full-time", pay: "₹5000/mo", location: "Sector 2" },
    { id: 11, title: "Mobile Repair Technician", type: "Full-time", pay: "₹10000/mo", location: "Tech Hub" },
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => 
      (filterType === 'All' || job.type === filterType) &&
      job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filterType, searchQuery]);

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
    setFormData({ fullName: '', phone: '', email: '', message: '', resume: null });
    setErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone Number must be 10 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    const submissionData = new FormData();
    submissionData.append('jobId', selectedJob.id);
    submissionData.append('jobTitle', selectedJob.title);
    submissionData.append('fullName', formData.fullName);
    submissionData.append('phone', formData.phone);
    submissionData.append('email', formData.email);
    submissionData.append('message', formData.message);
    if (formData.resume) submissionData.append('resume', formData.resume);

    try {
      await axios.post(`${API_URL}/api/jobs/apply`, submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert("Application Submitted Successfully!");
      setAppliedJobs([...appliedJobs, selectedJob.id]);
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppApply = (job) => {
    const adminNumber = "919876543210"; // Replace with your admin number
    const messageText = `Namaste! I want to apply for the position: ${job?.title}. My name is ${formData.fullName || '[Name]'}.`;
    const url = `https://wa.me/${adminNumber}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="jobs" className="py-24 bg-transparent text-white font-sans">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="font-heading text-4xl font-bold italic mb-12 text-center">Local <span className="text-brand-bright">Opportunities</span></h2>

        {/* Search and Filter Bar */}
        <div className="bg-brand-dark/80 backdrop-blur-xl border border-white/10 p-4 rounded-[2rem] shadow-lg mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search local jobs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-brand-bright transition-all outline-none text-white"
            />
          </div>
          
          <div className="flex overflow-x-auto w-full md:w-auto gap-2 pb-2 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterType(cat)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                  filterType === cat 
                  ? 'bg-brand-bright text-white shadow-md' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-400 font-bold">No matching opportunities found.</div>
          ) : (
            filteredJobs.map((job) => (
              <motion.div 
                key={job.id} 
                whileHover={{ y: -5 }}
                className={`group bg-white border ${job.urgent ? 'border-red-200' : 'border-green-100'} p-6 rounded-[2rem] hover:shadow-xl transition-all flex flex-col justify-between shadow-sm h-full`}
              >
                <div className="flex-1">
                  {job.urgent && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest mb-2 inline-block">Urgent</span>
                  )}
                  <h3 className="text-xl font-bold italic mb-3 text-[#1a1a1a] group-hover:text-brand-bright transition-colors">{job.title}</h3>
                  <div className="space-y-2 text-sm text-gray-400 mb-6">
                    <span className="flex items-center gap-2 font-medium"><MapPin size={14} className="text-brand-bright" /> {job.location}</span>
                    <span className="flex items-center gap-2 font-medium"><Clock size={14} className="text-brand-bright" /> {job.type}</span>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                  <p className="text-lg font-bold text-brand-bright">{job.pay}</p>
                  <button 
                    onClick={() => openModal(job)}
                    disabled={appliedJobs.includes(job.id)}
                    className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                      appliedJobs.includes(job.id) 
                      ? 'bg-gray-600 cursor-not-allowed text-gray-300' 
                      : 'bg-brand-bright text-white hover:bg-brand-medium shadow-md hover:scale-105 active:scale-95'
                    }`}
                  >
                    {appliedJobs.includes(job.id) ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-slate border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold font-heading text-white">Apply for <span className="text-brand-bright">{selectedJob?.title}</span></h3>
                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-futuristic-blue outline-none transition-all text-white" 
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone Number *</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-futuristic-blue outline-none transition-all text-white" 
                      placeholder="10 digit number"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email (Optional)</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-futuristic-blue outline-none transition-all text-white" 
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Upload Resume</label>
                  <div className="relative border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-futuristic-blue/50 transition-colors">
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={(e) => setFormData({...formData, resume: e.target.files[0]})}
                    />
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <FileText size={20} />
                      <span className="text-xs truncate max-w-full px-2">{formData.resume ? formData.resume.name : 'Click to upload PDF/DOC'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Message</label>
                  <textarea 
                    rows="3"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-futuristic-blue outline-none transition-all text-white" 
                    placeholder="Briefly describe your experience..."
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-brand-bright text-white font-bold py-3 rounded-xl hover:bg-brand-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : <><Send size={18} /> Submit Application</>}
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleWhatsAppApply(selectedJob)}
                    className="bg-natural-green p-3 rounded-xl hover:bg-emerald-700 transition-all text-white flex items-center justify-center"
                    title="Apply via WhatsApp"
                  >
                    <Phone size={24} />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default JobBoard;
