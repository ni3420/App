import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    Home, 
    MessageCircle, 
    Moon, 
    Sun, 
    User, 
    Settings, 
    LogOut, 
    PlusSquare,
    ChevronDown,
    Plus,
    Search,
    X
} from 'lucide-react'; 
import { toggletheme } from '../store/theme';
import { Logout } from '../store/authSlice';
import authService from '../AppWrite/auth';
import profileservice from '../AppWrite/profile';
import postservice from '../AppWrite/post';

const NavBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const authStatus = useSelector((state) => state.auth.status);
    const themeMode = useSelector((state) => state.theme.mode);
    const userData = useSelector((state) => state.auth.userData);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    
    const searchRef = useRef(null);
    const isDark = themeMode === 'dark';

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearching(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch Navbar Avatar
    useEffect(() => {
        const getAvatar = async () => {
            if (authStatus && userData?.$id) {
                try {
                    const profile = await profileservice.getProfile(userData.$id);
                    if (profile) setUserProfile(profile);
                } catch (err) {
                    console.log("Navbar Avatar Fetch Error", err);
                }
            }
        };
        getAvatar();
    }, [authStatus, userData?.$id]);

    // Search Logic with Debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim().length > 0 && authStatus) {
                try {
                    const res = await profileservice.ListProfile();
                    if (res) {
                        const filtered = res.documents.filter(user => 
                            user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        setSearchResults(filtered);
                        setIsSearching(true);
                    }
                } catch (err) {
                    console.error("Search error", err);
                }
            } else {
                setSearchResults([]);
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, authStatus]);

    const handleLogout = async () => {
        const logoutPromise = authService.handleSignOut();

        toast.promise(logoutPromise, {
            loading: 'Logging out...',
            success: () => {
                dispatch(Logout());
                setIsMenuOpen(false);
                navigate("/login");
                return 'Logged out successfully!';
            },
            error: 'Logout failed.',
        }, {
            style: {
                borderRadius: '10px',
                background: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#fff' : '#333',
            },
        });
    };

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) => `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
        isActive(path) 
        ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600') 
        : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
    }`;

    return (
        <>
            <nav className={`sticky top-0 z-[100] w-full border-b transition-all duration-300 ${
                isDark ? 'bg-slate-950/80 border-slate-800 text-white' : 'bg-white/80 border-gray-100 text-gray-800'
            } backdrop-blur-xl`}>
                <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center gap-4">
                    
                    {/* LOGO */}
                    <Link to={authStatus ? "/all_post" : "/"} className="flex items-center gap-2 group flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black rotate-3 group-hover:rotate-0 transition-transform">C</div>
                        <span className="hidden sm:block text-xl font-black tracking-tighter bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">Connect</span>
                    </Link>

                    {/* 1. SEARCH BAR - Only shows if logged in */}
                    {authStatus && (
                        <div className="flex-1 max-w-md relative" ref={searchRef}>
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all ${
                                isDark ? 'bg-slate-900 border-slate-800 focus-within:border-blue-500' : 'bg-gray-100 border-transparent focus-within:bg-white focus-within:border-blue-300'
                            }`}>
                                <Search size={18} className="text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search users..."
                                    className="bg-transparent text-sm outline-none w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length > 0 && setIsSearching(true)}
                                />
                                {searchQuery && <X size={16} className="cursor-pointer text-gray-400 hover:text-red-500" onClick={() => setSearchQuery("")}/>}
                            </div>

                            {/* Search Results Dropdown */}
                            {isSearching && (
                                <div className={`absolute top-full left-0 w-full mt-2 rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${
                                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
                                }`}>
                                    {searchResults.length > 0 ? (
                                        <div className="max-h-80 overflow-y-auto p-2">
                                            {searchResults.map((user) => (
                                                <div 
                                                    key={user.$id}
                                                    onClick={() => {
                                                        navigate(`/user_profile/${user.username}/${user.$id}`);
                                                        setIsSearching(false);
                                                        setSearchQuery("");
                                                    }}
                                                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-blue-500/10 transition-colors"
                                                >
                                                    <img 
                                                        src={postservice.ImagePost(user.avatarId) || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        alt="avatar"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold">{user.fullName}</span>
                                                        <span className="text-xs text-gray-500">@{user.username}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center text-sm text-gray-500 italic">No users found.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* RIGHT ACTIONS */}
                    <div className="flex items-center gap-2">
                        {/* 2. Desktop Links - Only shows if logged in */}
                        {authStatus && (
                            <div className="hidden lg:flex items-center gap-2 mr-2">
                                <Link to="/all_post" className={navLinkClass('/all_post')}><Home size={18} /></Link>
                                <Link to="/create_post" className={navLinkClass('/create_post')}><PlusSquare size={18} /></Link>
                            </div>
                        )}

                        {/* Theme Toggle - Always shows */}
                        <button onClick={() => dispatch(toggletheme())} className={`p-2.5 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-gray-100 text-slate-600'}`}>
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* 3. Conditional Auth/Profile Rendering */}
                        {authStatus ? (
                            <div className="flex items-center gap-2">
                                <Link to="/messages" className={navLinkClass('/messages')}><MessageCircle size={22} /></Link>
                                
                                <div className="relative">
                                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 border rounded-full flex items-center gap-1">
                                        <img src={postservice.ImagePost(userProfile?.avatarId) || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
                                        <ChevronDown size={14} className="hidden sm:block" />
                                    </button>

                                    {isMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-[-1]" onClick={() => setIsMenuOpen(false)}></div>
                                            <div className={`absolute right-0 mt-3 w-56 rounded-2xl border shadow-2xl py-2 z-[110] overflow-hidden ${
                                                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100 text-gray-800'
                                            }`}>
                                                <Link to={`/my_profile/${userData?.name}/${userData?.$id}`} className="block px-4 py-3 text-sm font-bold hover:bg-gray-100 dark:hover:bg-slate-800" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                                                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">Logout</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="px-5 py-2 text-sm font-bold hover:text-blue-500 transition-colors">Login</Link>
                                <Link 
                                    to="/signup" 
                                    className="px-6 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all"
                                >
                                    Join
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* MOBILE BOTTOM NAVIGATION - Only shows if logged in */}
            {authStatus && (
                <div className={`fixed bottom-0 left-0 z-[100] w-full h-16 sm:hidden border-t backdrop-blur-lg flex items-center justify-around px-6 ${
                    isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-gray-200'
                }`}>
                    <Link to="/all_post" className={`p-2 rounded-xl transition-all ${isActive('/all_post') ? 'text-blue-500 bg-blue-500/10' : 'text-gray-500'}`}>
                        <Home size={24} />
                    </Link>
                    <Link to="/create_post" className="relative -top-5 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/40 active:scale-90 transition-transform">
                        <Plus size={32} />
                    </Link>
                    <Link to={`/my_profile/${userData?.name}/${userData?.$id}`} className={`p-2 rounded-xl transition-all ${isActive(`/my_profile/${userData?.name}/${userData?.$id}`) ? 'text-blue-500 bg-blue-500/10' : 'text-gray-500'}`}>
                        <User size={24} />
                    </Link>
                </div>
            )}
        </>
    );
};

export default NavBar;