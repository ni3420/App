import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import postservice from "../AppWrite/post"; // Changed to default import if that's how you exported it
import PostCard from "./PostCard";

const AllPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const isDark = useSelector((state) => state.theme.mode === 'dark');

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await postservice.ListPost();
                if (res) {
                    setPosts(res.documents);
                }
            } catch (error) {
                console.error("AllPOST PAGE ERROR", error);
            } finally {
                // Keep loader visible for a split second for smooth transition
                setTimeout(() => setLoading(false), 500);
            }
        };
        getData();
    }, []);

    // 1. Logic to remove post from UI state instantly
    const handleDeletePostUI = (postId) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.$id !== postId));
    };

    return (
        <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
            <div className="max-w-xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Recent Posts
                    </h1>
                    <span className="text-xs font-bold px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full">
                        {posts.length} Posts
                    </span>
                </header>

                {loading ? (
                    [1, 2, 3].map((n) => <PostSkeleton key={n} isDark={isDark} />)
                ) : posts.length > 0 ? (
                    <div className="flex flex-col gap-6">
                        {posts.map((post) => (
                            <PostCard 
                                key={post.$id} 
                                post={post} 
                                // 2. Pass the delete function as a prop
                                onDelete={handleDeletePostUI} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className={`text-center py-20 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                        <p className="text-4xl mb-4">📭</p>
                        <p>No posts found. Start following people to see updates!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const PostSkeleton = ({ isDark }) => (
    <div className={`mb-6 p-4 rounded-2xl animate-pulse ${isDark ? 'bg-slate-900' : 'bg-white shadow-sm'}`}>
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-700/50"></div>
            <div className="h-4 w-24 bg-slate-700/50 rounded"></div>
        </div>
        <div className="h-48 w-full bg-slate-700/50 rounded-xl mb-4"></div>
        <div className="h-4 w-3/4 bg-slate-700/50 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-slate-700/50 rounded"></div>
    </div>
);

export default AllPost;