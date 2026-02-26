import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../zod/sign_up_schema';
import Input from '../Components/Input';
import Buttons from '../Components/Buttons';
import authService from '../AppWrite/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { User, Mail, Lock, UserPlus, ArrowRight, Loader2 } from 'lucide-react';

const Sign_up = () => {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    
    const themeMode = useSelector((state) => state.theme.mode);
    const isDark = themeMode === 'dark';

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(signupSchema)
    });

    const onSubmit = async (data) => {
        setServerError("");
        
        const signupPromise = (async () => {
            const res = await authService.handleSignUp(data);
            if (!res) throw new Error("Could not create account");
            return res;
        })();

        toast.promise(signupPromise, {
            loading: 'Creating your profile...',
            success: () => {
                navigate("/all_post");
                return "Account created! Welcome to Connect.";
            },
            error: (err) => {
                setServerError(err.message);
                return "Signup failed!";
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
            
            {/* Ambient Background Decorations */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-md z-10">
                <form 
                    onSubmit={handleSubmit(onSubmit)} 
                    className={`p-8 md:p-10 backdrop-blur-md rounded-[2rem] border transition-all duration-500 shadow-2xl ${
                        isDark 
                        ? 'bg-slate-900/40 border-slate-800 shadow-black/40' 
                        : 'bg-white/80 border-white shadow-slate-200'
                    }`}
                >
                    <div className="mb-10 text-center">
                        <div className="inline-flex p-4 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-500/30">
                            <UserPlus size={24} />
                        </div>
                        <h2 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Join Connect
                        </h2>
                        <p className={`text-sm mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Create an account to start sharing
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div className="group">
                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Full Name</label>
                            <div className="relative">
                                <Input 
                                    placeholder="Enter your full name"
                                    {...register("fullName")}
                                    error={errors.fullName}
                                    className={`pl-11 py-3.5 rounded-xl border-2 transition-all outline-none ${
                                        isDark 
                                        ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500/50 focus:bg-slate-800' 
                                        : 'bg-slate-50 border-slate-100 focus:border-blue-500/20 focus:bg-white'
                                    }`}
                                />
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            </div>
                        </div>

                        <div className="group">
                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Email Address</label>
                            <div className="relative">
                                <Input 
                                    type="email"
                                    placeholder="name@example.com"
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
                            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Password</label>
                            <div className="relative">
                                <Input 
                                    type="password"
                                    placeholder="Minimum 8 characters"
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
                        <div className="mt-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-center text-xs font-bold">
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
                                    Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Buttons>
                    </div>

                    <p className={`text-center text-sm mt-8 font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Already have an account?{" "}
                        <Link 
                            to="/login" 
                            className="text-blue-500 font-bold hover:text-blue-400 transition-colors underline underline-offset-4"
                        >
                            Log In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Sign_up;