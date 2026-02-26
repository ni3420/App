import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Grid, Info, Settings as SettingsIcon, Layout } from 'lucide-react';
import profileservice from "../AppWrite/profile";
import postservice from "../AppWrite/post";
import followservice from "../AppWrite/Follows";
import PostCard from "../PostPages/PostCard"; // Import your PostCard component

const MyProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [current, setCurrent] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [stats, setStats] = useState({
        followers: 0,
        following: 0,
        postsCount: 0
    });
    const [loading, setLoading] = useState(true);

    const isDark = useSelector((state) => state.theme.mode === 'dark');

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const profile = await profileservice.getProfile(id);
                if (profile) setCurrent(profile);

                const [posts, followers, following] = await Promise.all([
                    profileservice.getPostsByUserId(id),
                    followservice.getFollowers(id),
                    followservice.getFollowing(id)
                ]);

                if (posts) setUserPosts(posts.documents);
                
                setStats({
                    followers: followers?.total || 0,
                    following: following?.total || 0,
                    postsCount: posts?.total || 0
                });

            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [id]);

    // Handle instant UI update when a post is deleted from the profile
    const handleDeletePostUI = (postId) => {
        setUserPosts((prev) => prev.filter(p => p.$id !== postId));
        setStats(prev => ({ ...prev, postsCount: prev.postsCount - 1 }));
    };

    if (loading || !current) return (
        <div className={`flex h-screen items-center justify-center ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-800'}`}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-gray-800'}`}>
            <div className="max-w-2xl mx-auto pt-8 px-4 pb-20">
                
                {/* Profile Header */}
                <div className={`p-8 rounded-[2.5rem] border mb-8 transition-all shadow-2xl ${
                    isDark ? 'bg-slate-900/40 border-slate-800 shadow-black/20' : 'bg-white border-white shadow-slate-200'
                }`}>
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-32 h-32 rounded-[2.5rem] p-1 bg-gradient-to-tr from-blue-500 to-purple-600 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300">
                            <img 
                                src={postservice.ImagePost(current.avatarId) || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                alt="Avatar" 
                                className={`rounded-[2.2rem] w-full h-full object-cover border-4 ${isDark ? 'border-slate-900' : 'border-white'}`}
                            />
                        </div>

                        <div className="text-center w-full">
                            <h2 className="text-3xl font-black tracking-tighter mb-1">{current.username || "User"}</h2>
                            <p className="text-blue-500 font-bold text-sm mb-4">@{current.fullName?.replace(/\s+/g, '').toLowerCase()}</p>
                            
                            <div className="flex justify-center gap-8 mb-6 py-4 border-y border-slate-500/10">
                                <div className="text-center">
                                    <p className="text-xl font-black">{stats.postsCount}</p>
                                    <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Posts</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-black">{stats.followers}</p>
                                    <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Followers</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-black">{stats.following}</p>
                                    <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Following</p>
                                </div>
                            </div>

                            <p className={`text-sm font-medium mb-6 px-4 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                                {current.bio || "No bio description available yet."}
                            </p>

                            <div className="flex gap-3 justify-center">
                                <button 
                                    className="flex-1 max-w-[200px] bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all" 
                                    onClick={() => navigate(`/edit_profile/${current.fullName}/${current.$id}`)}
                                >
                                    Edit Profile
                                </button>
                                <button className={`p-3 rounded-2xl border transition-all active:scale-90 ${isDark ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                                    <SettingsIcon size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex justify-center gap-2 mb-8 bg-slate-500/5 p-1.5 rounded-2xl backdrop-blur-sm">
                    <button 
                        onClick={() => setActiveTab('posts')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === 'posts' 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                            : 'text-gray-500 hover:bg-slate-500/10'
                        }`}
                    >
                        <Layout size={14} /> Feed
                    </button>
                    <button 
                        onClick={() => setActiveTab('about')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === 'about' 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                            : 'text-gray-500 hover:bg-slate-500/10'
                        }`}
                    >
                        <Info size={14} /> Details
                    </button>
                </div>

                {/* Content Area */}
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {activeTab === 'posts' ? (
                        <div className="space-y-6">
                            {userPosts.length > 0 ? (
                                userPosts.map((post) => (
                                    <PostCard 
                                        key={post.$id} 
                                        post={post} 
                                        onDelete={handleDeletePostUI}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-20 opacity-30">
                                    <Layout size={60} className="mx-auto mb-4" />
                                    <p className="text-xl font-black italic">Nothing Shared Yet</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={`p-10 rounded-[2rem] border transition-all ${
                            isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-white shadow-slate-100'
                        }`}>
                            <h3 className="text-xl font-black tracking-tighter mb-6 text-blue-500 uppercase text-xs">About Me</h3>
                            <p className={`text-base font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'} whitespace-pre-wrap`}>
                                {current.about || current.bio || "This user prefers to keep things a mystery."}
                            </p>
                            
                            {current.location && (
                                <div className="mt-8 pt-6 border-t border-slate-500/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Based in</p>
                                    <p className="font-bold">{current.location}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfilePage;