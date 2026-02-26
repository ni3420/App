import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MessageSquare, Grid, Bookmark, UserPlus, UserCheck } from 'lucide-react';
import profileservice from '../AppWrite/profile';
import PostCard from '../PostPages/PostCard';
import Buttons from '../Components/Buttons';
import followrservice from "../AppWrite/Follows";

const UserProfile = () => {
    const { id, name } = useParams(); // id is the profile owner's ID
    const navigate = useNavigate();
    const isDark = useSelector((state) => state.theme.mode === 'dark');
    const loggedInUser = useSelector((state) => state.auth.userData);

    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [stats, setStats] = useState({
        followers: 0,
        following: 0,
        postsCount: 0
    });

    // 1. Initialize Profile Stats and Follow Status
    useEffect(() => {
        const initProfile = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [posts, followers, following, followStatus] = await Promise.all([
                    profileservice.getPostsByUserId(id), // Fetch user's posts
                    followrservice.getFollowers(id),   // Who follows this profile
                    followrservice.getFollowing(id),   // Who this profile follows
                    followrservice.isFollowing(loggedInUser?.$id, id) // Am I following them?
                ]);

                if (posts) setUserPosts(posts.documents);
                
                setStats({
                    followers: followers?.total || 0,
                    following: following?.total || 0,
                    postsCount: posts?.total || 0
                });
                
                setIsFollowing(!!followStatus);
            } catch (error) {
                console.error("Profile Init Error:", error);
            } finally {
                setLoading(false);
            }
        };

        initProfile();
    }, [id, loggedInUser?.$id]);

    // 2. Toggle Follow Logic
    const handleFollowToggle = async () => {
        if (!loggedInUser) return navigate('/login');

        // Optimistic UI Update
        const previousState = isFollowing;
        setIsFollowing(!previousState);
        setStats(prev => ({
            ...prev,
            followers: previousState ? prev.followers - 1 : prev.followers + 1
        }));

        try {
            const result = await followrservice.toggleFollow(loggedInUser.$id, id);
            if (!result) throw new Error("Operation failed");
        } catch (error) {
            // Rollback on failure
            setIsFollowing(previousState);
            setStats(prev => ({
                ...prev,
                followers: previousState ? prev.followers + 1 : prev.followers - 1
            }));
            console.log(error)
        }
    };
    const handle=()=>{
      navigate("/messages")
    }

    if (loading) return <div className="p-10 text-center animate-pulse h-screen">Loading Profile...</div>;

    return (
        <div className={`min-h-screen pb-10 ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            
            {/* PROFILE HEADER */}
            <div className={`border-b ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                <div className="max-w-4xl mx-auto p-6 md:p-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        
                        {/* Avatar */}
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1 shadow-lg">
                            <img 
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} 
                                alt="profile" 
                                className={`w-full h-full rounded-full object-cover border-4 ${isDark ? 'border-slate-900' : 'border-white'}`}
                            />
                        </div>

                        {/* User Details */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                                <h2 className="text-2xl font-bold">{name}</h2>
                                
                                <div className="flex gap-2 justify-center">
                                    {loggedInUser?.$id !== id ? (
                                        <>
                                            <Buttons 
                                                onClick={handleFollowToggle}
                                                className={`px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-all ${
                                                    isFollowing 
                                                    ? 'bg-gray-200 text-gray-800 hover:bg-red-100 hover:text-red-600' 
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                            >
                                                {isFollowing ? <><UserCheck size={18}/> Following</> : <><UserPlus size={18}/> Follow</>}
                                            </Buttons>
                                            
                                            <Buttons 
                                                className="px-6 py-2 rounded-full bg-transparent border border-gray-300 dark:border-slate-700 text-sm font-semibold flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-800"
                                            >
                                                
                                                <MessageSquare size={16}  onClick={handle}/> Message
                                            </Buttons>
                                        </>
                                    ) : (
                                        <Buttons 
                                            onClick={() => navigate(`/edit_profile/${loggedInUser.name}/${loggedInUser.$id}`)}
                                            className="px-6 py-2 rounded-full border border-gray-300 dark:border-slate-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800"
                                        >
                                            Edit Profile
                                        </Buttons>
                                    )}
                                </div>
                            </div>

                            {/* Stats Counters */}
                            <div className="flex justify-center md:justify-start gap-8">
                                <div className="cursor-default">
                                    <span className="block font-bold text-xl">{stats.postsCount}</span>
                                    <span className="text-sm text-gray-500">Posts</span>
                                </div>
                                <div className="cursor-pointer group">
                                    <span className="block font-bold text-xl group-hover:text-blue-500">{stats.followers}</span>
                                    <span className="text-sm text-gray-500">Followers</span>
                                </div>
                                <div className="cursor-pointer group">
                                    <span className="block font-bold text-xl group-hover:text-blue-500">{stats.following}</span>
                                    <span className="text-sm text-gray-500">Following</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="max-w-4xl mx-auto mt-6 px-4">
                {/* Tabs */}
                <div className="flex justify-center gap-12 border-b dark:border-slate-800 mb-6">
                    <button className="flex items-center gap-2 pb-4 border-b-2 border-blue-500 text-blue-500 font-bold text-sm">
                        <Grid size={18} /> POSTS
                    </button>
                    <button className="flex items-center gap-2 pb-4 text-gray-500 font-bold text-sm hover:text-blue-400">
                        <Bookmark size={18} /> SAVED
                    </button>
                </div>

                {/* Posts List */}
                <div className="max-w-xl mx-auto">
                    {userPosts.length > 0 ? (
                        userPosts.map(post => (
                            <PostCard 
                                key={post.$id} 
                                post={post} 
                                onDelete={(postId) => setUserPosts(prev => prev.filter(p => p.$id !== postId))}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 opacity-40">
                            <Grid size={64} className="mx-auto mb-4 stroke-1" />
                            <p className="text-xl font-medium">No posts yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;