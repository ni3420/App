import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { useSelector } from 'react-redux';

const Not_Found = () => {
    const navigate = useNavigate();
    const isDark = useSelector((state) => state.theme.mode === 'dark');

    return (
        <div className={`min-h-[90vh] flex flex-col items-center justify-center px-6 transition-colors duration-300 ${
            isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-800'
        }`}>
            {/* Animated Icon */}
            <div className="relative mb-8">
                <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                <Ghost size={120} className="relative text-blue-500 animate-bounce" />
            </div>

            {/* Error Message */}
            <div className="text-center space-y-4 max-w-md">
                <h1 className="text-8xl font-black tracking-tighter bg-gradient-to-b from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    404
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold">Lost in Space?</h2>
                <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    The page you are looking for doesn't exist or has been moved to another universe.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-sm sm:max-w-none justify-center">
                <button 
                    onClick={() => navigate(-1)}
                    className={`flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all border ${
                        isDark 
                        ? 'border-slate-800 hover:bg-slate-900 bg-slate-950' 
                        : 'border-gray-200 hover:bg-white bg-gray-50'
                    }`}
                >
                    <ArrowLeft size={18} />
                    Go Back
                </button>

                <Link 
                    to="/all_post"
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-bold bg-blue-600 text-white transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/30 active:scale-95"
                >
                    <Home size={18} onClick={()=>navigate("/all-post")}/>
                    Feed
                </Link>
            </div>

            {/* Footer hint */}
            <p className="mt-12 text-xs text-gray-500 opacity-50 uppercase tracking-widest">
                Error Code: PAGE_NOT_FOUND
            </p>
        </div>
    );
};

export default Not_Found;