'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { removeFromCart, addToCart, updateCartQuantity, clearCart } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthModal } from '@/context/AuthModalContext';
import { useGetMeQuery } from '@/redux/api/userApi';

export default function CartPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const { openAuthModal } = useAuthModal();
    const { data: user, isLoading } = useGetMeQuery(undefined);

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingCost = subtotal > 600 ? 50 : 0;
    const tax = 0;
    const total = subtotal + shippingCost + tax;

    const handleRemoveItem = (itemId: string, size?: string) => {
        dispatch(removeFromCart({ id: itemId, size }));
        toast.success('Item removed from cart');
    };

    const handleUpdateQuantity = (itemId: string, size: string | undefined, newQuantity: number) => {
        if (newQuantity > 0) {
            dispatch(updateCartQuantity({ id: itemId, size, quantity: newQuantity }));
        }
    };

    const handleCheckout = () => {
        if (!isLoading && !user) {
            toast.error('Please sign in to proceed');
            openAuthModal('/checkout');
        } else if (user) {
            router.push('/checkout');
        }
    };

    return (
        <div className="min-h-screen bg-black pt-24 pb-12">
            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <motion.button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[#a87522] hover:text-[#8e621d] transition-colors"
                    whileHover={{ x: -5 }}
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </motion.button>
            </div>

            {/* Cart Container */}
            <div className="max-w-7xl mx-auto px-6">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-['Poppins'] font-bold text-[42px] text-white mb-8"
                >
                    Shopping Cart
                </motion.h1>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <ShoppingCart size={80} className="mx-auto text-gray-600 mb-6" />
                        <p className="text-gray-400 text-xl font-['Poppins'] mb-8">Your cart is empty</p>
                        <Link href="/products">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 bg-[#a87522] hover:bg-[#8e621d] text-white rounded-lg font-semibold transition-colors"
                            >
                                Continue Shopping
                            </motion.button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2 space-y-4"
                        >
                            {cartItems.map((item) => (
                                <motion.div
                                    key={`${item.id}-${item.size}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-br from-[#1a1410] to-black border border-[#3a3027] rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6"
                                >
                                    {/* Product Image */}
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-black/40">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* product Info and Controls Wrapper */}
                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                                        {/* Product Info */}
                                        <div className="flex-1">
                                            <h3 className="font-['Poppins'] font-bold text-white text-base sm:text-lg mb-2">
                                                {item.name}
                                            </h3>
                                            <p className="text-[#a87522] font-semibold">
                                                ₹{item.price.toFixed(2)}
                                            </p>
                                            <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                                Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Quantity Control */}
                                        <div className="flex sm:flex-col items-center gap-3 sm:gap-3 sm:justify-center">
                                            <div className="flex items-center gap-1 sm:gap-2 border border-[#3a3027] rounded-lg p-1 sm:p-2 bg-black/40">
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity - 1)}
                                                    className="p-1 hover:bg-[#a87522]/20 rounded transition-colors"
                                                >
                                                    <Minus size={14} className="sm:size-4 text-[#a87522]" />
                                                </motion.button>
                                                <span className="w-6 sm:w-8 text-center text-white font-semibold text-sm">
                                                    {item.quantity}
                                                </span>
                                                <motion.button
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
                                                    className="p-1 hover:bg-[#a87522]/20 rounded transition-colors"
                                                >
                                                    <Plus size={14} className="sm:size-4 text-[#a87522]" />
                                                </motion.button>
                                            </div>

                                            {/* Remove Button */}
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleRemoveItem(item.id, item.size)}
                                                className="p-1.5 sm:p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                                title="Remove item"
                                            >
                                                <Trash2 size={16} className="sm:size-5" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gradient-to-br from-[#1a1410] to-black border border-[#3a3027] rounded-xl p-8 h-fit sticky top-28"
                        >
                            <h2 className="font-['Poppins'] font-bold text-white text-lg mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-300">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Delivery Charge (COD)</span>
                                    <span className={shippingCost === 0 ? 'text-green-400 font-medium' : 'text-[#a87522]'}>
                                        {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="border-t border-[#3a3027] pt-4 flex justify-between font-['Poppins'] font-bold text-white text-lg">
                                    <span>Total</span>
                                    <span className="text-[#a87522]">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {subtotal > 600 && (
                                <p className="text-[#a87522] text-xs mb-4 p-2 bg-[#a87522]/10 rounded border border-[#a87522]/20">
                                    Note: ₹50 charge applies for COD orders above ₹600.
                                </p>
                            )}

                            <motion.button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-gradient-to-r from-[#a87522] to-[#8e621d] hover:from-[#b89340] hover:to-[#a0731a] text-white rounded-lg font-['Poppins'] font-semibold transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Loading...' : 'Proceed to Checkout'}
                            </motion.button>

                            <Link href="/products" className="block">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 border border-[#a87522]/30 text-[#a87522] rounded-lg font-['Poppins'] font-semibold hover:bg-[#a87522]/5 transition-all"
                                >
                                    Continue Shopping
                                </motion.button>
                            </Link>

                            {cartItems.length > 0 && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        dispatch(clearCart());
                                        toast.success('Cart cleared');
                                    }}
                                    className="w-full mt-4 py-3 border border-red-500/30 text-red-500 rounded-lg font-['Poppins'] font-semibold hover:bg-red-500/5 transition-all"
                                >
                                    Clear Cart
                                </motion.button>
                            )}
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
