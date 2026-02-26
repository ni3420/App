import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Send, Clock, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { likeservice } from '../AppWrite/likes'; 
import { Commentservice } from '../AppWrite/comments';
import { useNavigate } from 'react-router-dom';
import postservice from '../AppWrite/post';
import toast from 'react-hot-toast'; // Import toast

const PostCard = ({ post, onDelete }) => {
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const isDark = useSelector((state) => state.theme.mode === 'dark');
    const userData = useSelector((state) => state.auth.userData);
    
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const [showMenu, setShowMenu] = useState(false);

    const isAuthor = userData?.$id === post?.userId;

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch Likes and Comments
    useEffect(() => {
        const fetchStats = async () => {
            if (!post?.$id) return;
            try {
                const [likeData, commentData] = await Promise.all([
                    likeservice.getLikeCount(post.$id),
                    Commentservice.getComments(post.$id)
                ]);
                
                if (likeData) {
                    setLikes(likeData.total || 0);
                    const userHasLiked = likeData.documents?.some(item => item.userId === userData?.$id);
                    setIsLiked(!!userHasLiked);
                }
                if (commentData) {
                    setComments(commentData.documents || []);
                }
            } catch (err) {
                console.error("Stats fetch error:", err);
            }
        };
        fetchStats();
    }, [post?.$id, userData?.$id]);

    const handleLike = async () => {
        if (!userData) return navigate('/login');
        const previouslyLiked = isLiked;
        setIsLiked(!previouslyLiked);
        setLikes(prev => previouslyLiked ? prev - 1 : prev + 1);
        try {
            await likeservice.togglePostLike(post.$id, userData.$id);
        } catch (error) {
            setIsLiked(previouslyLiked);
            setLikes(prev => previouslyLiked ? prev + 1 : prev - 1);
            console.log(error)
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !userData) return;
        try {
            const newComment = await Commentservice.createComment(
                post.$id, 
                userData.$id, 
                commentText, 
                userData.avatar || "", 
                userData.name
            );
            setComments([newComment, ...comments]);
            setCommentText("");
            toast.success("Comment added!");
        } catch (error) {
            toast.error("Failed to add comment");
        }
    };

    // REFRESH & TOAST LOGIC FOR DELETE
    const handleDelete = async () => {
        if (!window.confirm("Delete this post permanently?")) return;
        
        const toastId = toast.loading("Deleting post..."); // Start loading toast
        setShowMenu(false); // Close the menu immediately

        try {
            const success = await postservice.DeletePost(post.$id);
            if (success) {
                toast.success("Post deleted successfully", { id: toastId }); // Update to success
                if (onDelete) {
                    onDelete(post.$id); // Refresh parent component state
                }
            } else {
                toast.error("Failed to delete post", { id: toastId });
            }
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Something went wrong", { id: toastId });
        }
    };

    const formatTime = (date) => {
        if (!date) return "";
        const now = new Date();
        const diff = Math.floor((now - new Date(date)) / 1000);
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className={`mb-6 rounded-2xl border relative transition-all duration-500 hover:shadow-lg ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100 shadow-md'
        }`}>
            
            {/* HEADER */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/user_profile/${post.username}/${post.userId}`)}>
                    <div className="w-10 h-10 rounded-full bg-blue-500 overflow-hidden">
                        <img src={post.userAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm leading-none">{post.username || "User"}</h4>
                        <span className="text-[10px] text-gray-500">{formatTime(post.$createdAt)}</span>
                    </div>
                </div>

                <div className="relative" ref={menuRef}>
                    <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
                        <MoreHorizontal size={20} className="text-gray-400" />
                    </button>
                    {showMenu && (
                        <div className={`absolute right-0 mt-2 w-36 rounded-xl border shadow-lg z-50 overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                            {isAuthor ? (
                                <>
                                    <button onClick={() => navigate(`/update_post/${post.$id}`)} className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                        <Pencil size={14} /> Edit
                                    </button>
                                    <button onClick={handleDelete} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-semibold">
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </>
                            ) : (
                                <button className="w-full px-4 py-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Report</button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* CONTENT */}
            <div className="px-4 pb-2">
                <h3 className="font-bold text-lg leading-snug">{post.title}</h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{post.content}</p>
            </div>

            {post.image && (
                <div className="w-full bg-gray-50 dark:bg-slate-950">
                    <img src={postservice.ImagePost(post.image)} alt="post" className="w-full h-auto max-h-[500px] object-contain mx-auto" />
                </div>
            )}

            {/* ACTIONS */}
            <div className="p-4 flex gap-6 border-t dark:border-slate-800 mt-2">
                <button onClick={handleLike} className={`flex items-center gap-2 transition-transform active:scale-90 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
                    <Heart size={22} fill={isLiked ? "currentColor" : "none"} /> 
                    <span className="font-bold text-sm">{likes}</span>
                </button>
                <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-2 transition-colors ${showComments ? 'text-blue-500' : 'text-gray-500'}`}>
                    <MessageCircle size={22} /> 
                    <span className="font-bold text-sm">{comments.length}</span>
                </button>
            </div>

            {/* COMMENTS */}
            {showComments && (
                <div className="px-4 pb-4 space-y-4 border-t dark:border-slate-800 pt-4 animate-in fade-in duration-300">
                    <form onSubmit={handleAddComment} className="flex gap-2">
                        <input 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className={`flex-1 text-sm p-3 px-4 rounded-xl outline-none border transition-all focus:ring-2 focus:ring-blue-500/20 ${
                                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'
                            }`}
                        />
                        <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-transform active:scale-90">
                            <Send size={18} />
                        </button>
                    </form>
                    
                    <div className="max-h-64 overflow-y-auto space-y-4 custom-scrollbar">
                        {comments.length > 0 ? comments.map(c => (
                            <div key={c.$id} className="flex gap-3 items-start">
                                <img src={c.userAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-8 h-8 rounded-full object-cover mt-1 border dark:border-slate-700" alt="" />
                                <div className={`flex-1 p-3 rounded-2xl text-xs ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-blue-500">@{c.username}</span>
                                        <span className="text-[10px] text-gray-500 font-normal">{formatTime(c.$createdAt)}</span>
                                    </div>
                                    <p className="leading-relaxed">{c.content}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-xs text-center text-gray-500 italic py-2">Be the first to comment!</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;