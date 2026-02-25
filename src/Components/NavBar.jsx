import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    Home, 
    MessageCircle, 
    Moon, 
    Sun, 
    User, 
    Settings, 
    LogOut, 
    MoreVertical 
} from 'lucide-react'; // Import Lucide Icons
import { toggletheme } from '../store/theme';
import { Logout } from '../store/authSlice';
import authService from '../AppWrite/auth';

const NavBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const authStatus = useSelector((state) => state.auth.status);
    const themeMode = useSelector((state) => state.theme.mode);
    const userData = useSelector((state) => state.auth.userData);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isDark = themeMode === 'dark';

    const handleLogout = async () => {
        await authService.handleSignOut();
        dispatch(Logout());
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`sticky top-0 z-50 w-full px-4 md:px-8 py-2 border-b backdrop-blur-lg transition-all duration-300 ${
            isDark ? 'bg-slate-950/80 border-slate-800 text-white' : 'bg-white/80 border-gray-200 text-gray-800'
        }`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                
                <div className="flex items-center gap-8">
                    <Link to="/" className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Connect
                    </Link>

                    {authStatus && (
                        <div className="hidden md:flex items-center">
                            <Link 
                                to="/all_post" 
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                    isActive('/all_post') 
                                    ? (isDark ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600') 
                                    : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                <Home size={18} /> <span>Home</span>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Theme Toggle */}
                    <button 
                        onClick={() => dispatch(toggletheme())}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
                    </button>

                    {authStatus ? (
                        <div className="flex items-center gap-2 md:gap-4">
                            <Link 
                                to="/messages" 
                                className={`relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition ${
                                    isActive('/messages') ? 'text-blue-500' : ''
                                }`}
                            >
                                <MessageCircle size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white dark:border-slate-950"></span>
                            </Link>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center group transition-transform active:scale-95 ml-2"
                                >
                                    <img 
                                        src={userData?.profile?.avatarUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                        alt="profile" 
                                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                                    />
                                </button>

                                {isMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-[-1]" onClick={() => setIsMenuOpen(false)}></div>
                                        <div className={`absolute right-0 mt-4 w-52 border rounded-2xl shadow-2xl py-2 overflow-hidden ${
                                            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100 text-gray-800'
                                        }`}>
                                            <Link 
                                                to={`/my_profile/${userData?.$id}`} 
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-slate-800"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <User size={16} /> Profile
                                            </Link>
                                            <Link 
                                                to="/settings" 
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-slate-800"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <Settings size={16} /> Settings
                                            </Link>
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border-t border-gray-100 dark:border-slate-800 mt-1"
                                            >
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="px-4 py-2 text-sm font-bold">Login</Link>
                            <Link to="/signup" className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;