import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../zod/Loginschema';
import Input from '../Components/Input';
import Buttons from '../Components/Buttons';
import authService from '../AppWrite/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Added useSelector
import { Login } from '../store/authSlice';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Listen to theme from Redux to toggle background/text colors
    const themeMode = useSelector((state) => state.theme.mode);
    const isDark = themeMode === 'dark';

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        try {
            const session = await authService.handleSignIn(data);
            if (session) {
                const userData = await authService.CurrentUser();
                if (userData) dispatch(Login(userData));
                navigate("/");
            }
        } catch (error) {
            console.error("Login failed:", error.message);
        }
    };

    return (
        <div className={`flex justify-center items-center min-h-screen transition-colors duration-300 ${
            isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-800'
        } p-4`}>
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className={`w-full max-w-md p-8 shadow-2xl rounded-3xl border transition-colors ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
                }`}
            >
                <div className="mb-8 text-center">
                    <h2 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Welcome Back
                    </h2>
                    <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'} mt-2`}>
                        Enter your credentials to access your feed
                    </p>
                </div>

                <Input 
                    label="Email"
                    type="email"
                    placeholder="name@company.com"
                    {...register("email")}
                    error={errors.email}
                    // Pass theme props if your Input component supports them
                    className={isDark ? "bg-slate-800 border-slate-700 text-white" : ""}
                />

                <Input 
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    error={errors.password}
                    className={isDark ? "bg-slate-800 border-slate-700 text-white" : ""}
                />

                <div className="flex justify-end mb-6">
                    <Link to="/forgot-password" size="sm" className="text-sm text-blue-500 hover:text-blue-400 font-medium">
                        Forgot password?
                    </Link>
                </div>

                <Buttons 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Verifying..." : "Log In"}
                </Buttons>

                <p className={`text-center text-sm mt-8 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    Don't have an account?{" "}
                    <Link 
                        to="/signup" 
                        className="text-blue-500 font-bold hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;