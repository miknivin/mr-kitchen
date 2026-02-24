'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { useLoginMutation, useRegisterMutation, useGoogleLoginMutation } from '@/redux/api/authApi';
import { useGetMeQuery } from '@/redux/api/userApi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/context/AuthModalContext';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const router = useRouter();
    const { redirectUrl } = useAuthModal();

    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
    const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setEmail('');
            setPassword('');
            setName('');
            setShowPassword(false);
        }
    }, [isOpen]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password }).unwrap();
            toast.success("Login successful!");
            setEmail('');
            setPassword('');
            // Save redirect URL before closing modal (which resets it)
            const redirectPath = redirectUrl || '/profile';
            onClose();
            // Navigate to redirect URL or profile page
            router.push(redirectPath);
        } catch (err: any) {
            toast.error(err.data?.error || err.data?.message || "Login failed");
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register({ name, email, password }).unwrap();
            toast.success("Account created! Logging you in...");
            setEmail('');
            setPassword('');
            // Save redirect URL before closing modal (which resets it)
            const redirectPath = redirectUrl || '/profile';
            onClose();
            // Navigate to redirect URL or profile page after signup
            router.push(redirectPath);
        } catch (err: any) {
            toast.error(err.data?.error || err.data?.message || "Sign up failed");
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;
            await googleLogin({
                name: firebaseUser.displayName || '',
                email: firebaseUser.email || '',
                avatar: firebaseUser.photoURL || '',
            }).unwrap();
            const redirectPath = redirectUrl || '/profile';
            onClose();
            toast.success('Google Sign-In successful!');
            router.push(redirectPath);
        } catch (err: any) {
            if (err?.code === 'auth/popup-closed-by-user') return;
            toast.error(err?.data?.error || err?.data?.message || 'Google Sign-In failed');
        }
    };

    const GoogleIcon = () => (
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.273 0 3.191 2.727 1.245 6.666l4.021 3.099z"
            />
            <path
                fill="#FBBC05"
                d="M1.245 6.666a7.11 7.11 0 0 0 0 10.668l4.02-3.1a4.233 4.233 0 0 1 0-4.47l-4.02-3.098z"
            />
            <path
                fill="#34A853"
                d="M12 24c3.055 0 5.782-1.145 7.91-3l-3.39-2.77c-1.154.773-2.618 1.254-4.52 1.254-4.109 0-7.582-2.818-8.827-6.573L1.245 17.334C3.191 21.273 7.273 24 12 24z"
            />
            <path
                fill="#4285F4"
                d="M23.491 12.273c0-.818-.082-1.609-.227-2.364H12v4.582h6.482a5.536 5.536 0 0 1-2.4 3.636l3.39 2.77c1.982-1.827 3.127-4.527 3.127-7.624v-.001z"
            />
        </svg>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[440px] w-[92%] bg-black border border-[#a87522]/30 p-0 rounded-[20px] sm:rounded-[25px] shadow-2xl shadow-[#a87522]/20 overflow-hidden [&>button]:hidden">
                <div className="relative">
                    {/* Custom Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 z-[60] text-[#a87522] hover:text-[#cc973f] transition-colors p-1"
                    >
                        <X size={24} />
                    </button>

                    {/* Header Background Decoration */}
                    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#4a2f03] to-transparent opacity-20" />

                    <div className="relative p-5 sm:p-6 pt-5 sm:pt-6">
                        <DialogHeader className="mb-3 sm:mb-4">
                            <DialogTitle className="font-['Poppins'] font-bold text-[20px] sm:text-[26px] text-white text-center leading-tight">
                                Welcome to <span className="bg-gradient-to-r from-[#aa7722] to-[#cc973f] bg-clip-text text-transparent">Mr. Kitchen</span>
                            </DialogTitle>
                            <p className="text-[#e5e5e5]/60 text-center font-['Poppins'] text-[13px] sm:text-[14px] mt-0.5 sm:mt-1">
                                Join our premium kitchen community
                            </p>
                        </DialogHeader>

                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-lg sm:rounded-xl mb-4 sm:mb-5">
                                <TabsTrigger value="login" className="rounded-md sm:rounded-lg font-['Poppins'] text-[13px] sm:text-[15px] text-white/50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#a87522] data-[state=active]:to-[#774b03] data-[state=active]:text-white h-8 sm:h-10 transition-all">
                                    Sign In
                                </TabsTrigger>
                                <TabsTrigger value="signup" className="rounded-md sm:rounded-lg font-['Poppins'] text-[13px] sm:text-[15px] text-white/50 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#a87522] data-[state=active]:to-[#774b03] data-[state=active]:text-white h-8 sm:h-10 transition-all">
                                    Sign Up
                                </TabsTrigger>
                            </TabsList>

                            <div className="space-y-3 sm:space-y-4">
                                <TabsContent value="login" className="outline-none">
                                    <form onSubmit={handleLogin} className="space-y-2.5 sm:space-y-3">
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a87522] w-4 h-4 sm:w-5 sm:h-5" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Email Address"
                                                className="w-full h-[44px] sm:h-[48px] bg-white/5 border border-white/10 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-4 font-['Poppins'] text-white focus:border-[#a87522] outline-none transition-all placeholder:text-white/30 text-[13px] sm:text-[14px]"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a87522] w-4 h-4 sm:w-5 sm:h-5" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Password"
                                                className="w-full h-[44px] sm:h-[48px] bg-white/5 border border-white/10 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-10 font-['Poppins'] text-white focus:border-[#a87522] outline-none transition-all placeholder:text-white/30 text-[13px] sm:text-[14px]"
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        <div className="flex justify-end">
                                            <button type="button" className="text-[#a87522] hover:text-[#cc973f] text-[12px] sm:text-[13px] font-['Poppins'] transition-colors">
                                                Forgot Password?
                                            </button>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isLoginLoading}
                                            className="w-full h-[44px] sm:h-[48px] bg-gradient-to-r from-[#a87522] to-[#774b03] rounded-lg sm:rounded-xl font-['Poppins'] font-bold text-[15px] sm:text-[16px] text-white shadow-lg shadow-[#a87522]/20 hover:scale-[1.01] active:scale-[0.99] transition-all mt-1 disabled:opacity-50"
                                        >
                                            {isLoginLoading ? "Signing In..." : "Sign In"}
                                        </button>
                                    </form>
                                </TabsContent>

                                <TabsContent value="signup" className="outline-none">
                                    <form onSubmit={handleSignUp} className="space-y-2.5 sm:space-y-3">
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a87522] w-4 h-4 sm:w-5 sm:h-5" />
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Full Name"
                                                className="w-full h-[44px] sm:h-[48px] bg-white/5 border border-white/10 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-4 font-['Poppins'] text-white focus:border-[#a87522] outline-none transition-all placeholder:text-white/30 text-[13px] sm:text-[14px]"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a87522] w-4 h-4 sm:w-5 sm:h-5" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Email Address"
                                                className="w-full h-[44px] sm:h-[48px] bg-white/5 border border-white/10 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-4 font-['Poppins'] text-white focus:border-[#a87522] outline-none transition-all placeholder:text-white/30 text-[13px] sm:text-[14px]"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a87522] w-4 h-4 sm:w-5 sm:h-5" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Password"
                                                className="w-full h-[44px] sm:h-[48px] bg-white/5 border border-white/10 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-10 font-['Poppins'] text-white focus:border-[#a87522] outline-none transition-all placeholder:text-white/30 text-[13px] sm:text-[14px]"
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isRegisterLoading}
                                            className="w-full h-[44px] sm:h-[48px] bg-gradient-to-r from-[#a87522] to-[#774b03] rounded-lg sm:rounded-xl font-['Poppins'] font-bold text-[15px] sm:text-[16px] text-white shadow-lg shadow-[#a87522]/20 hover:scale-[1.01] active:scale-[0.99] transition-all mt-1 disabled:opacity-50"
                                        >
                                            {isRegisterLoading ? "Creating..." : "Create Account"}
                                        </button>
                                    </form>
                                </TabsContent>
                            </div>

                            {/* Divider */}
                            <div className="relative my-4 sm:my-5">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-[11px] sm:text-[12px] uppercase">
                                    <span className="bg-black px-3 text-white/30 font-['Poppins'] tracking-wider">Or continue with</span>
                                </div>
                            </div>

                            {/* Google Sign In */}
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={isGoogleLoading}
                                className="w-full h-[44px] sm:h-[48px] bg-white font-['Poppins'] font-semibold text-[14px] sm:text-[15px] text-black flex items-center justify-center rounded-lg sm:rounded-xl hover:bg-[#f5f5f5] active:scale-[0.99] transition-all mb-3 sm:mb-4 disabled:opacity-50"
                            >
                                <GoogleIcon />
                                {isGoogleLoading ? "Connecting..." : "Sign in with Google"}
                            </button>
                        </Tabs>

                        <p className="text-center text-white/30 font-['Poppins'] text-[11px] sm:text-[12px] mt-4 sm:mt-5 max-w-[260px] sm:max-w-[280px] mx-auto pb-2">
                            By continuing, you agree to Mr. Kitchen's
                            <span className="text-[#a87522] mx-1 cursor-pointer hover:underline">Terms</span>
                            and
                            <span className="text-[#a87522] mx-1 cursor-pointer hover:underline">Privacy</span>.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
