import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, FALLBACK_IMAGE, resolveMediaUrl } from '../services/config.js';

const MediaGallery = () => {
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/media`);
      setMedia(res.data);
    } catch (err) {
      console.error("Error fetching media", err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);

    setUploading(true);
    try {
      await axios.post(`${API_URL}/api/media/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFile(null);
      fetchMedia();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="py-24 bg-light-beige/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark-slate">Community <span className="text-futuristic-blue">Media Wall</span></h2>
          <p className="text-gray-500 mt-2">Share your village moments with everyone</p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="mb-16 max-w-md mx-auto flex gap-4">
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-natural-green file:text-white
              hover:file:bg-natural-green/80"
          />
          <button 
            type="submit" 
            disabled={uploading || !file}
            className="px-6 py-2 bg-dark-slate text-white rounded-full font-bold disabled:opacity-50"
          >
            {uploading ? '...' : 'Upload'}
          </button>
        </form>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {media.map((item) => (
            <div key={item._id} className="aspect-square rounded-2xl overflow-hidden shadow-md group relative">
              {item.type === 'video' ? (
                <video 
                  src={resolveMediaUrl(item.url)} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={resolveMediaUrl(item.url)} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold px-2 text-center">{item.name}</span>
              </div>
            </div>
          ))}
          
          {media.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
              <div className="text-gray-300 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-400">No media uploaded yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaGallery;
