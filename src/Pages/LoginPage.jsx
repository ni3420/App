import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../zod/Loginschema';
import Input from '../Components/Input';
import Buttons from '../Components/Buttons';
import authService from '../AppWrite/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Login } from '../store/authSlice';
import toast from 'react-hot-toast';
import { Lock, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [serverError, setServerError] = useState("");
    
    const themeMode = useSelector((state) => state.theme.mode);
    const isDark = themeMode === 'dark';

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        setServerError("");
        
        const loginPromise = (async () => {
            const session = await authService.handleSignIn(data);
            if (!session) throw new Error("Invalid credentials");
            
            const userData = await authService.CurrentUser();
            if (!userData) throw new Error("User data not found");
            
            dispatch(Login(userData));
            return userData;
        })();

        toast.promise(loginPromise, {
            loading: 'Verifying your account...',
            success: (user) => {
                navigate("/all_post");
                return `Welcome back, ${user.name}!`;
            },
            error: (err) => {
                setServerError(err.message);
                return "Login failed!";
            },
        }, {
            style: {
                borderRadius: '12px',
                background: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#fff' : '#333',
            },
        });
    };

    return (
        <div className={`relative flex justify-center items-center min-h-screen transition-all duration-700 overflow-hidden ${
            isDark ? 'bg-slate-950 text-white' : 'bg-[#f8fafc] text-slate-800'
        } p-4`}>
            
            {/* Soft Ambient Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-md z-10">
                {/* Logo/Brand Area */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Sparkles size={24} />
                    </div>
                </div>

                <form 
                    onSubmit={handleSubmit(onSubmit)} 
                    className={`p-8 md:p-10 backdrop-blur-md rounded-[2rem] border transition-all duration-500 shadow-2xl ${
                        isDark 
                        ? 'bg-slate-900/40 border-slate-800 shadow-black/40' 
                        : 'bg-white/80 border-white shadow-slate-200'
                    }`}
                >
                    <div className="mb-10 text-center">
                        <h2 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Welcome Back
                        </h2>
                        <p className={`text-sm mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Sign in to continue your journey
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div className="group">
                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Email Address</label>
                            <div className="relative">
                                <Input 
                                    type="email"
                                    placeholder="john@example.com"
                                    {...register("email")}
                                    error={errors.email}
                                    className={`pl-11 py-3.5 rounded-xl border-2 transition-all outline-none ${
                                        isDark 
                                        ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500/50 focus:bg-slate-800' 
                                        : 'bg-slate-50 border-slate-100 focus:border-blue-500/20 focus:bg-white'
                                    }`}
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            </div>
                        </div>

                        <div className="group">
                            <div className="flex justify-between items-center mb-2 ml-1">
                                <label className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Password</label>
                                <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-wider">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input 
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                    error={errors.password}
                                    className={`pl-11 py-3.5 rounded-xl border-2 transition-all outline-none ${
                                        isDark 
                                        ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500/50 focus:bg-slate-800' 
                                        : 'bg-slate-50 border-slate-100 focus:border-blue-500/20 focus:bg-white'
                                    }`}
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            </div>
                        </div>
                    </div>

                    {serverError && (
                        <div className="mt-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-center text-xs font-bold animate-pulse">
                            {serverError}
                        </div>
                    )}

                    <div className="mt-8">
                        <Buttons 
                            type="submit" 
                            className={`w-full group py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl ${
                                isSubmitting 
                                ? 'bg-slate-700 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
                            }`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Log In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Buttons>
                    </div>

                    <p className={`text-center text-sm mt-8 font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Don't have an account?{" "}
                        <Link 
                            to="/signup" 
                            className="text-blue-500 font-bold hover:text-blue-400 transition-colors"
                        >
                            Join Connect
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;