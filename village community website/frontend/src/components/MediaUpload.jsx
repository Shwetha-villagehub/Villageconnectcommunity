import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, Film, AlertCircle, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../services/config.js';

const MediaUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validation: 50MB limit
    if (selectedFile.size > 50 * 1024 * 1024) {
      setErrorMessage('File size exceeds 50MB limit.');
      setStatus('error');
      return;
    }

    setFile(selectedFile);
    setStatus('idle');
    setErrorMessage('');

    // Generate Preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('media', file);

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${API_URL}/api/media/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload media');

      const data = await response.json();
      setStatus('success');
      if (onUploadSuccess) onUploadSuccess(data);
      
      // Clear after success
      setTimeout(clearSelection, 2000);
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl">
      <h2 className="font-heading text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Upload className="text-futuristic-blue" /> Share a Moment
      </h2>

      {!preview ? (
        <div 
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-white/20 rounded-3xl p-12 text-center cursor-pointer hover:border-natural-green/50 transition-colors group"
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <FileImage className="text-gray-400 group-hover:text-natural-green" />
          </div>
          <p className="text-gray-300 font-sans">Click to upload images or videos</p>
          <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">Max 50MB</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-3xl overflow-hidden bg-black/20">
          <button onClick={clearSelection} className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors">
            <X size={18} />
          </button>
          
          {file.type.startsWith('video') ? (
            <video src={preview} className="w-full aspect-video object-cover" controls />
          ) : (
            <img src={preview} alt="Preview" className="w-full aspect-video object-cover" />
          )}

          <div className="p-6 flex items-center justify-between bg-dark-slate/60 backdrop-blur-md">
            <div className="flex items-center gap-3">
              {file.type.startsWith('video') ? <Film size={20} className="text-futuristic-purple" /> : <FileImage size={20} className="text-futuristic-blue" />}
              <span className="text-sm text-gray-200 truncate max-w-[150px]">{file.name}</span>
            </div>
            
            <button
              onClick={handleUpload}
              disabled={status === 'uploading'}
              className={`px-8 py-2.5 rounded-full font-bold transition-all ${
                status === 'uploading' ? 'bg-gray-600' : 'bg-natural-green hover:shadow-lg hover:shadow-natural-green/40'
              } text-white`}
            >
              {status === 'uploading' ? 'Uploading...' : 'Upload Now'}
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {status === 'error' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-200 text-sm">
            <AlertCircle size={18} /> {errorMessage}
          </motion.div>
        )}
        {status === 'success' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 p-4 bg-natural-green/20 border border-natural-green/50 rounded-2xl flex items-center gap-3 text-natural-green text-sm">
            <CheckCircle2 size={18} /> Upload complete! Your media is live.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaUpload;
