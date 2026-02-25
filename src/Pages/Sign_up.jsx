import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../zod/sign_up_schema';
import Input from '../Components/Input';
import Buttons from '../Components/Buttons';
import authService from '../AppWrite/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // 1. Import useSelector

const Sign_up = () => {
    const navigate = useNavigate();
    
    // 2. Access theme from Redux
    const themeMode = useSelector((state) => state.theme.mode);
    const isDark = themeMode === 'dark';

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(signupSchema)
    });

    const onSubmit = async (data) => {
        try {
           const res= await authService.handleSignUp(data);
           if(res) navigate("/all_post");
        } catch (error) {
            console.error("Signup failed:", error.message);
        }
    };

    

    return (
        // 3. Dynamic background color
        <div className={`flex justify-center items-center min-h-screen transition-colors duration-300 ${
            isDark ? 'bg-slate-950' : 'bg-gray-50'
        }`}>
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                // 4. Dynamic card and border color
                className={`w-full max-w-md p-8 shadow-2xl rounded-3xl border transition-colors duration-300 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
                }`}
            >
                <h2 className={`text-2xl font-bold mb-6 text-center ${
                    isDark ? 'text-white' : 'text-gray-900'
                }`}>
                    Create Account
                </h2>

                <Input 
                    label="Full Name"
                    placeholder="Enter your full name"
                    {...register("fullName")}
                    error={errors.fullName}
                    // Ensure your Input component accepts custom classNames for theme
                    className={isDark ? "bg-slate-800 border-slate-700 text-white" : ""}
                />

                <Input 
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    error={errors.email}
                    className={isDark ? "bg-slate-800 border-slate-700 text-white" : ""}
                />

                <Input 
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                    {...register("password")}
                    error={errors.password}
                    className={isDark ? "bg-slate-800 border-slate-700 text-white" : ""}
                />

                <Buttons 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl mt-4 font-bold shadow-lg shadow-blue-500/20"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating Account..." : "Sign Up"}
                </Buttons>

                <p className={`text-center text-sm mt-6 ${
                    isDark ? 'text-slate-400' : 'text-gray-600'
                }`}>
                    Already have an account?{" "}
                    <Link 
                        to="/login" 
                        className="text-blue-500 font-semibold hover:underline"
                    >
                        Log In
                    </Link>
                </p>
            </form>


        </div>
    );
}

export default Sign_up;