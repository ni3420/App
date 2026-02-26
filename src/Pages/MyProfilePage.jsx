import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Grid, Info, Settings as SettingsIcon, Heart, MessageCircle } from 'lucide-react';
import profileservice from "../AppWrite/profile";
import postservice from "../AppWrite/post";
import followservice from "../AppWrite/Follows";

const MyProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // States
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
                // 1. Fetch Profile Details
                const profile = await profileservice.getProfile(id);
                if (profile) setCurrent(profile);

                // 2. Fetch Posts, Followers, and Following in Parallel
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

    if (loading || !current) return (
        <div className={`flex h-screen items-center justify-center ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-800'}`}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-800'}`}>
            <div className="max-w-4xl mx-auto pt-8 px-4">
                
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-10">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-purple-600 shadow-xl">
                        <img 
                            src={postservice.ImagePost(current.avatarId) || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                            alt="Avatar" 
                            className={`rounded-full w-full h-full object-cover border-4 ${isDark ? 'border-slate-950' : 'border-white'}`}
                        />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                            <h2 className="text-2xl font-bold">{current.username || "User"}</h2>
                            <div className="flex gap-2">
                                <button 
                                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                                        isDark ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700' : 'bg-white border border-gray-300 hover:bg-gray-50 shadow-sm'
                                    }`} 
                                    onClick={() => navigate(`/edit_profile/${current.fullName}/${current.$id}`)}
                                >
                                    Edit Profile
                                </button>
                                <button className={`p-1.5 rounded-lg border transition-colors ${isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-gray-300 hover:bg-gray-100'}`}>
                                    <SettingsIcon size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-center md:justify-start gap-8 mb-6">
                            <span><strong className="text-blue-500">{stats.postsCount}</strong> posts</span>
                            <span className="cursor-pointer hover:opacity-70"><strong className="text-blue-500">{stats.followers}</strong> followers</span>
                            <span className="cursor-pointer hover:opacity-70"><strong className="text-blue-500">{stats.following}</strong> following</span>
                        </div>

                        <div className="max-w-md">
                            <p className="font-bold text-lg">{current.fullName}</p>
                            <p className={`text-sm leading-relaxed mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                                {current.bio || "No bio description available yet."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className={`flex justify-center border-t ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                    <button 
                        onClick={() => setActiveTab('posts')}
                        className={`flex items-center gap-2 px-10 py-4 text-xs font-bold tracking-widest uppercase border-t-2 transition-all ${
                            activeTab === 'posts' 
                            ? (isDark ? 'border-blue-400 text-blue-400' : 'border-black text-black') 
                            : 'border-transparent text-gray-500 opacity-50 hover:opacity-100'
                        }`}
                    >
                        <Grid size={14} /> Posts
                    </button>
                    <button 
                        onClick={() => setActiveTab('about')}
                        className={`flex items-center gap-2 px-10 py-4 text-xs font-bold tracking-widest uppercase border-t-2 transition-all ${
                            activeTab === 'about' 
                            ? (isDark ? 'border-blue-400 text-blue-400' : 'border-black text-black') 
                            : 'border-transparent text-gray-500 opacity-50 hover:opacity-100'
                        }`}
                    >
                        <Info size={14} /> About
                    </button>
                </div>

                {/* Content Area */}
                <div className="py-8">
                    {activeTab === 'posts' ? (
                        userPosts.length > 0 ? (
                            <div className="grid grid-cols-3 gap-1 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {userPosts.map((post) => (
                                    <div 
                                        key={post.$id} 
                                        className={`aspect-square rounded-lg group relative overflow-hidden cursor-pointer ${
                                            isDark ? 'bg-slate-900' : 'bg-gray-200'
                                        }`}
                                        onClick={() => navigate(`/post/${post.$id}`)}
                                    >
                                        {post.image ? (
                                            <img 
                                                src={postservice.ImagePost(post.image)} 
                                                alt={post.title} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs overflow-hidden italic">
                                                {post.title}
                                            </div>
                                        )}
                                        {/* Overlay on Hover */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                                            <div className="flex items-center gap-1"><Heart size={18} fill="white" /></div>
                                            <div className="flex items-center gap-1"><MessageCircle size={18} fill="white" /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 opacity-40">
                                <Grid size={48} className="mx-auto mb-4" />
                                <p className="text-xl font-semibold">No Posts Yet</p>
                            </div>
                        )
                    ) : (
                        <div className={`p-8 rounded-2xl border animate-in fade-in zoom-in-95 duration-300 ${
                            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
                        }`}>
                            <h3 className="text-lg font-bold mb-4">Detailed Bio</h3>
                            <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} whitespace-pre-wrap`}>
                                {current.about || current.bio || "Information about this user is currently private or not yet provided."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfilePage;