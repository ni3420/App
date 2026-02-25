import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Footer = () => {
    const themeMode = useSelector((state) => state.theme.mode);

    return (
        <footer className={`w-full py-10 px-6 border-t transition-colors ${
            themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-gray-100 text-gray-600'
        }`}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                
                {/* Brand Section */}
                <div className="col-span-1 md:col-span-1">
                    <Link to="/" className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        Connect
                    </Link>
                    <p className="mt-4 text-sm leading-relaxed">
                        Connecting the world through code and creativity. Build your network, share your journey.
                    </p>
                </div>

                {/* Navigation Links */}
                <div>
                    <h3 className={`font-bold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Platform</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-blue-500 transition">Home Feed</Link></li>
                        <li><Link to="/explore" className="hover:text-blue-500 transition">Explore</Link></li>
                        <li><Link to="/messages" className="hover:text-blue-500 transition">Messages</Link></li>
                    </ul>
                </div>

                {/* Support Links */}
                <div>
                    <h3 className={`font-bold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Support</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/help" className="hover:text-blue-500 transition">Help Center</Link></li>
                        <li><Link to="/privacy" className="hover:text-blue-500 transition">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="hover:text-blue-500 transition">Terms of Use</Link></li>
                    </ul>
                </div>

                {/* Social/Copyright */}
                <div>
                    <h3 className={`font-bold mb-4 ${themeMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>Connect</h3>
                    <div className="flex gap-4 text-xl">
                        <span className="cursor-pointer hover:text-blue-400">𝕏</span>
                        <span className="cursor-pointer hover:text-pink-500">📸</span>
                        <span className="cursor-pointer hover:text-blue-700">💼</span>
                    </div>
                    <p className="mt-4 text-xs">
                        &copy; {new Date().getFullYear()} Gemini. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;