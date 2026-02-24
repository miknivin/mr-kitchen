'use client';
import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Package, LogOut, ChevronRight, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useLogoutMutation } from '@/redux/api/authApi';
import { useGetMeQuery } from '@/redux/api/userApi';
import { useGetOrdersByUserQuery } from '@/redux/api/orderApi';
import { useAuthModal } from '@/context/AuthModalContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Order {
    id: string;
    date: string;
    status: string;
    total: string;
    items: string;
}

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    address: string;
    joinedDate: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const { openAuthModal } = useAuthModal();
    const { data: user, isLoading: userLoading, error: userError } = useGetMeQuery(undefined);
    const { data: ordersData, isLoading: ordersLoading } = useGetOrdersByUserQuery(undefined, {
        pollingInterval: 10000 // Refresh list every 10 seconds
    });
    const [logout] = useLogoutMutation();
    const isInitialMount = useRef(true);

    // Handle auth state and redirect logic
    useEffect(() => {
        if (!userLoading) {
            if (userError || !user) {
                // User is not authenticated
                if (isInitialMount.current) {
                    // Opening modal for first time users trying to access profile
                    openAuthModal();
                    isInitialMount.current = false;
                } else {
                    // If trying to access profile after logout, redirect to home
                    router.push('/');
                }
            } else {
                // User is authenticated, mark initial mount as done
                isInitialMount.current = false;
            }
        }
    }, [userLoading, userError, user, openAuthModal, router]);

    const handleLogout = async () => {
        try {
            await logout(undefined).unwrap();
            toast.success("Logged out successfully");
            router.push('/');
        } catch (err) {
            toast.error("Logout failed");
        }
    };

    // Always show loading while data is being fetched
    if (userLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] pt-[120px] pb-20 px-6 lg:px-[139px] flex items-center justify-center">
                <p className="text-white font-['Poppins']">Loading profile...</p>
            </div>
        );
    }

    // If not authenticated, don't render profile content
    if (userError || !user) {
        return null;
    }

    const orders = ordersData || [];

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-[120px] pb-20 px-6 lg:px-[139px]">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-['Poppins'] font-bold text-white mb-2">
                            My <span className="text-[#a87522]">Profile</span>
                        </h1>
                        <p className="text-white/60 font-['Poppins']">Manage your account and view order history</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-white/80 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-all font-['Poppins'] font-semibold"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Info Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-8 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#a87522] to-transparent" />

                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-24 h-24 bg-gradient-to-br from-[#a87522] to-[#774b03] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-[#a87522]/20">
                                    <User size={40} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-['Poppins'] font-bold text-white">{user.name}</h3>
                                <p className="text-[#a87522] font-['Poppins'] text-sm">Premium Member</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                        <Mail size={18} className="text-[#a87522]" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-white/40 text-xs font-['Poppins'] uppercase tracking-wider">Email Address</p>
                                        <p className="text-white font-['Poppins'] truncate">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone size={18} className="text-[#a87522]" />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs font-['Poppins'] uppercase tracking-wider">Phone Number</p>
                                        <p className="text-white font-['Poppins']">{user.phone || "Not provided"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin size={18} className="text-[#a87522]" />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs font-['Poppins'] uppercase tracking-wider">Primary Address</p>
                                        <p className="text-white font-['Poppins'] text-sm leading-relaxed">{user.address || "Not provided"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                        <Calendar size={18} className="text-[#a87522]" />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs font-['Poppins'] uppercase tracking-wider">Member Since</p>
                                        <p className="text-white font-['Poppins']">{new Date(user.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full h-12 bg-white/5 border border-white/10 rounded-xl font-['Poppins'] font-semibold text-white hover:bg-[#a87522] hover:border-[#a87522] transition-all mt-8">
                                Edit Profile
                            </button>
                        </div>
                    </motion.div>

                    {/* Order History */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white/[0.03] border border-white/10 rounded-[30px] p-8 h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <Package size={24} className="text-[#a87522]" />
                                <h2 className="text-2xl font-['Poppins'] font-bold text-white">Order History</h2>
                            </div>

                            <div className="space-y-4">
                                {orders.map((order: any, index: number) => (
                                    <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                                        onClick={() => router.push(`/profile/orders/${order._id}`)}
                                        className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-[#a87522]/30 hover:bg-white/[0.06] transition-all group cursor-pointer"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#a87522]/10 rounded-xl flex items-center justify-center text-[#a87522] font-bold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-['Poppins'] font-bold group-hover:text-[#a87522] transition-colors">Order #{order._id.slice(-6).toUpperCase()}</h4>
                                                    <p className="text-white/40 text-sm font-['Poppins']">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-white font-['Poppins'] font-bold">₹{order.totalAmount}</p>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${(order.orderStatus || order.status) === 'Delivered' ? 'bg-green-500/20 text-green-500' :
                                                        (order.orderStatus || order.status) === 'Shipped' ? 'bg-blue-500/20 text-blue-500' :
                                                            (order.orderStatus || order.status) === 'Cancelled' ? 'bg-red-500/20 text-red-500' :
                                                                (order.orderStatus || order.status) === 'Returned' || (order.orderStatus || order.status) === 'Refunded' ? 'bg-purple-500/20 text-purple-500' :
                                                                    'bg-yellow-500/20 text-yellow-500'
                                                        }`}>
                                                        {order.orderStatus || order.status}
                                                    </span>
                                                </div>
                                                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-[#a87522] transition-all">
                                                    <ChevronRight size={20} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-white/5">
                                            <p className="text-white/60 text-sm font-['Poppins'] flex items-center gap-2">
                                                <span className="text-[#a87522]">•</span> {(order.orderItems || order.items)?.length || 0} Items
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
