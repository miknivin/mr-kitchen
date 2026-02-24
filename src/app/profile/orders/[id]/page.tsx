'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
    ArrowLeft, Package, MapPin, CreditCard, Clock,
    CheckCircle2, Truck, XCircle, Loader2, ShoppingBag
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useGetOrderDetailsQuery } from '@/redux/api/orderApi';

const StatusStep = ({
    icon: Icon,
    label,
    done,
    active,
}: {
    icon: any;
    label: string;
    done: boolean;
    active: boolean;
}) => (
    <div className="flex flex-col items-center gap-2 flex-1">
        <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
            ${done ? 'bg-[#a87522] text-white' : active ? 'bg-[#a87522]/20 text-[#a87522] border border-[#a87522]' : 'bg-white/5 text-white/20 border border-white/10'}`}
        >
            <Icon size={18} />
        </div>
        <span className={`text-xs font-['Poppins'] text-center ${done || active ? 'text-[#a87522]' : 'text-white/30'}`}>{label}</span>
    </div>
);

const statusSteps = [
    { key: 'Processing', label: 'Processing', icon: Loader2 },
    { key: 'Shipped', label: 'Shipped', icon: Truck },
    { key: 'Delivered', label: 'Delivered', icon: CheckCircle2 },
];

function getStepIndex(status: string) {
    return statusSteps.findIndex((s) => s.key === status);
}

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const { data: order, isLoading, error } = useGetOrderDetailsQuery(id, {
        skip: !id,
        pollingInterval: 5000 // Poll every 5 seconds to get live status updates
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] pt-[120px] pb-20 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-[#a87522] border-t-transparent rounded-full animate-spin" />
                    <p className="text-white/60 font-['Poppins']">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] pt-[120px] pb-20 flex items-center justify-center">
                <div className="text-center">
                    <XCircle size={48} className="text-red-400 mx-auto mb-4" />
                    <h2 className="text-white text-2xl font-['Poppins'] font-bold mb-2">Order Not Found</h2>
                    <p className="text-white/40 font-['Poppins'] mb-6">The order you're looking for doesn't exist.</p>
                    <button
                        onClick={() => router.push('/profile')}
                        className="px-6 py-3 bg-[#a87522] text-white rounded-xl font-['Poppins'] font-semibold hover:bg-[#8e621d] transition-colors"
                    >
                        Back to Profile
                    </button>
                </div>
            </div>
        );
    }

    // Unified fields — supports both old and new schema
    const status = order.orderStatus || order.status || 'Processing';
    const items = order.orderItems || order.items || [];
    const shipping = order.shippingInfo || null;
    const isCancelled = status === 'Cancelled';
    const currentStepIndex = getStepIndex(status);
    const paymentMethod = order.paymentMethod === 'COD' || order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online';
    const paymentStatus = order.paymentInfo?.status || order.paymentStatus || 'Pending';

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-[120px] pb-20 px-6 lg:px-[139px]">
            <div className="max-w-4xl mx-auto">

                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.push('/profile')}
                    className="flex items-center gap-2 text-white/50 hover:text-[#a87522] transition-colors mb-8 font-['Poppins'] group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Profile
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl font-['Poppins'] font-bold text-white">
                            Order <span className="text-[#a87522]">#{order._id?.slice(-6).toUpperCase()}</span>
                        </h1>
                        <p className="text-white/40 font-['Poppins'] mt-1">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'long', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <span className={`self-start md:self-auto px-4 py-2 rounded-full text-sm font-['Poppins'] font-bold uppercase tracking-wider
                        ${status === 'Delivered' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            status === 'Shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                status === 'Cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                    status === 'Returned' || status === 'Refunded' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                        {status}
                    </span>
                </motion.div>

                <div className="space-y-6">

                    {/* Order Status Timeline */}
                    {!isCancelled && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/[0.03] border border-white/10 rounded-[24px] p-6 md:p-8"
                        >
                            <h2 className="text-white font-['Poppins'] font-bold text-lg mb-6 flex items-center gap-2">
                                <Truck size={20} className="text-[#a87522]" />
                                Order Status
                            </h2>
                            <div className="flex items-start gap-0 relative">
                                <div className="absolute top-5 left-0 right-0 h-[2px] bg-white/10 mx-5" />
                                <div
                                    className="absolute top-5 left-0 h-[2px] bg-[#a87522] mx-5 transition-all duration-700"
                                    style={{ width: currentStepIndex >= 0 ? `calc(${(currentStepIndex / (statusSteps.length - 1)) * 100}% - 40px)` : '0%' }}
                                />
                                {statusSteps.map((step, i) => (
                                    <StatusStep
                                        key={step.key}
                                        icon={step.icon}
                                        label={step.label}
                                        done={i < currentStepIndex}
                                        active={i === currentStepIndex}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Order Items */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white/[0.03] border border-white/10 rounded-[24px] p-6 md:p-8"
                    >
                        <h2 className="text-white font-['Poppins'] font-bold text-lg mb-6 flex items-center gap-2">
                            <ShoppingBag size={20} className="text-[#a87522]" />
                            Order Items ({items.length})
                        </h2>
                        <div className="space-y-4">
                            {items.map((item: any, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + index * 0.05 }}
                                    className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-[#a87522]/20 transition-colors"
                                >
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 border border-white/10">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package size={24} className="text-white/20" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="text-white font-['Poppins'] font-semibold">{item.name}</h4>
                                            <p className="text-white/40 text-sm font-['Poppins']">₹{Number(item.price).toFixed(2)} each</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/50 text-sm font-['Poppins']">
                                                Qty: <span className="text-white font-semibold">{item.quantity}</span>
                                            </span>
                                            <span className="text-[#a87522] font-['Poppins'] font-bold">
                                                ₹{(Number(item.price) * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Shipping Address */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/[0.03] border border-white/10 rounded-[24px] p-6 md:p-8"
                        >
                            <h2 className="text-white font-['Poppins'] font-bold text-lg mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-[#a87522]" />
                                Shipping Address
                            </h2>
                            {shipping ? (
                                <div className="space-y-2 text-sm font-['Poppins']">
                                    {shipping.fullName && <p className="text-white font-semibold">{shipping.fullName}</p>}
                                    <p className="text-white/80">{shipping.address}</p>
                                    {shipping.address2 && <p className="text-white/60">{shipping.address2}</p>}
                                    <p className="text-white/60">{shipping.city}{shipping.state ? `, ${shipping.state}` : ''}</p>
                                    <p className="text-white/60">{shipping.zipCode}</p>
                                    <p className="text-white/60">{shipping.country}</p>
                                    {shipping.phoneNo && <p className="text-white/60 pt-2">📞 {shipping.phoneNo}</p>}
                                    {shipping.email && <p className="text-white/60">✉ {shipping.email}</p>}
                                    {order.orderNotes && (
                                        <p className="text-white/40 mt-3 pt-3 border-t border-white/5 italic">"{order.orderNotes}"</p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-white/40 text-sm font-['Poppins']">Shipping details not available</p>
                            )}
                        </motion.div>

                        {/* Payment Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-white/[0.03] border border-white/10 rounded-[24px] p-6 md:p-8"
                        >
                            <h2 className="text-white font-['Poppins'] font-bold text-lg mb-4 flex items-center gap-2">
                                <CreditCard size={20} className="text-[#a87522]" />
                                Payment Details
                            </h2>
                            <div className="space-y-3 text-sm font-['Poppins']">
                                <div className="flex justify-between text-white/60">
                                    <span>Payment Method</span>
                                    <span className="text-white font-semibold">{paymentMethod}</span>
                                </div>
                                <div className="flex justify-between text-white/60">
                                    <span>Payment Status</span>
                                    <span className={`font-semibold ${paymentStatus === 'Completed' || paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {paymentStatus}
                                    </span>
                                </div>
                                {order.itemsPrice != null && (
                                    <div className="flex justify-between text-white/60">
                                        <span>Subtotal</span>
                                        <span className="text-white">₹{Number(order.itemsPrice).toFixed(2)}</span>
                                    </div>
                                )}
                                {order.shippingAmount != null && (
                                    <div className="flex justify-between text-white/60">
                                        <span>Shipping</span>
                                        <span className="text-white">{Number(order.shippingAmount) === 0 ? 'FREE' : `₹${Number(order.shippingAmount).toFixed(2)}`}</span>
                                    </div>
                                )}
                                {order.taxAmount != null && (
                                    <div className="flex justify-between text-white/60">
                                        <span>Tax</span>
                                        <span className="text-white">₹{Number(order.taxAmount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                    <span className="text-white font-bold text-base">Total</span>
                                    <span className="text-[#a87522] font-bold text-xl">₹{Number(order.totalAmount).toFixed(2)}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}
