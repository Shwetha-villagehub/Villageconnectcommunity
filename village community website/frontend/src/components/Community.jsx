import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../supabaseClient.js';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setPosts(data);
    setLoading(false);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please login to post");

    const { error } = await supabase.from('posts').insert([
      { content: newPost, user_id: user.id, username: user.user_metadata.username || 'Villager' }
    ]);

    if (!error) {
      setNewPost('');
      fetchPosts();
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-dark/5 text-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="font-heading text-4xl font-bold italic mb-8 text-center">
          Village <span className="text-brand-bright">Voice</span>
        </h2>

        {!isSupabaseConfigured && (
          <div className="mb-8 rounded-[2rem] border border-amber-300/40 bg-amber-100/10 p-5 text-center text-sm text-amber-100">
            Community posting is temporarily unavailable until Supabase environment variables are configured.
          </div>
        )}

        <form onSubmit={handlePost} className="mb-12 bg-white/5 p-6 rounded-[2rem] border border-white/10 shadow-xl">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share an update or ask a question..."
            disabled={!isSupabaseConfigured}
            className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none mb-4"
            rows="3"
          />
          <div className="flex justify-end">
            <button type="submit" disabled={!isSupabaseConfigured} className="bg-brand-bright text-white px-8 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-brand-medium transition-all disabled:cursor-not-allowed disabled:opacity-60">
              <Send size={18} /> Post
            </button>
          </div>
        </form>

        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-gray-400">Loading discussion...</p>
          ) : !isSupabaseConfigured ? (
            <p className="text-center text-gray-300">Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable community posts.</p>
          ) : posts.map((post) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={post.id} className="bg-white/5 border border-white/10 p-6 rounded-[2rem]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-bright/20 rounded-full flex items-center justify-center text-brand-bright">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-brand-bright">@{post.username}</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-200 leading-relaxed">{post.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
