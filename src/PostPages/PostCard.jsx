import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark } from 'lucide-react';
import { useSelector } from 'react-redux';
import postservice from '../AppWrite/post';

const PostCard = ({ post }) => {
    const isDark = useSelector((state) => state.theme.mode === 'dark');
    const [liked, setLiked] = useState(false);
    return (
        <div className={`max-w-xl mx-auto mb-6 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100 text-gray-900'
        } shadow-sm hover:shadow-md`}>
            
            {/* Header: Author Info */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5">
                        <img 
                            src={post.authorAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                            className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-900"
                            alt="avatar"
                        />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">{post.name || "Anonymous"}</h4>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Content: Image/Text */}
            <div className="px-4 pb-2">
                <p className="text-sm mb-3">{post.title}</p>
            </div>
            {post.featuredImage && (
                <div className="w-full bg-gray-100 dark:bg-slate-800">
                    <img src={postservice.ImagePost(post.image)} alt="post" className="w-full h-auto max-h-[500px] object-cover" />
                </div>
            )}

            {/* Footer: Interaction Buttons */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setLiked(!liked)}
                            className={`flex items-center gap-1.5 transition ${liked ? 'text-red-500' : 'hover:text-red-500'}`}
                        >
                            <Heart size={22} fill={liked ? "currentColor" : "none"} />
                            <span className="text-xs font-semibold">2.4k</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-blue-500 transition">
                            <MessageCircle size={22} />
                            <span className="text-xs font-semibold">120</span>
                        </button>
                        <button className="hover:text-green-500 transition">
                            <Share2 size={22} />
                        </button>
                    </div>
                    <button className="hover:text-yellow-500 transition">
                        <Bookmark size={22} />
                    </button>
                </div>

                {/* Quick Comment Input */}
                <div className="flex items-center gap-2 mt-2">
                    <input 
                        type="text" 
                        placeholder="Add a comment..." 
                        className={`flex-1 text-sm p-2 rounded-xl border outline-none transition ${
                            isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'
                        } focus:ring-1 focus:ring-blue-500`}
                    />
                    <button className="text-blue-500 text-sm font-bold px-2">Post</button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;