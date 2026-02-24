'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useCreateOrderMutation } from '@/redux/api/orderApi';
import { clearCart } from '@/redux/slices/cartSlice';
import { motion } from 'motion/react';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuthModal } from '@/context/AuthModalContext';
import { useGetMeQuery } from '@/redux/api/userApi';

export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const user = useSelector((state: RootState) => state.user.user);
    const { openAuthModal } = useAuthModal();
    const { data: userProfile, isLoading: authLoading } = useGetMeQuery(undefined);
    const [createOrder, { isLoading }] = useCreateOrderMutation();
    const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
    const [isBuyNow, setIsBuyNow] = useState(false);
    const [isItemsLoaded, setIsItemsLoaded] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        street: '',
        city: '',
        postalCode: '',
        message: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [paymentMethod, setPaymentMethod] = useState('cod'); // COD or online

    useEffect(() => {
        // Check for Buy Now item
        const buyNowData = sessionStorage.getItem('buyNowItem');
        if (buyNowData) {
            try {
                const item = JSON.parse(buyNowData);
                setCheckoutItems([item]);
                setIsBuyNow(true);
            } catch (e) {
                console.error("Error parsing buyNowItem", e);
                setCheckoutItems(cartItems);
            }
        } else {
            setCheckoutItems(cartItems);
            setIsBuyNow(false);
        }
        setIsItemsLoaded(true);
    }, [cartItems]);

    useEffect(() => {
        // Wait for items to be loaded from storage/cart
        if (!isItemsLoaded || isSubmitted) return;

        // If cart is empty and no buy now item, redirect to products
        const hasItems = checkoutItems.length > 0;
        if (!hasItems && !isLoading && !authLoading) {
            toast.error('Your cart is empty');
            setTimeout(() => router.push('/products'), 2000);
        }

        // If user is not authenticated, show auth modal
        if (!authLoading && !userProfile && !user) {
            toast.error('Please sign in to proceed');
            openAuthModal('/checkout');
        }
    }, [checkoutItems.length, router, isLoading, authLoading, userProfile, user, openAuthModal]);

    // Calculate totals
    const subtotal = checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const codCharge = (paymentMethod === 'cod' && subtotal > 600) ? 50 : 0;
    const shippingCost = codCharge;
    const tax = 0;
    const total = subtotal + shippingCost + tax;

    // Form validation
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.street.trim()) newErrors.street = 'Street address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Phone validation (basic)
        const phoneRegex = /^[0-9]{10}$/;
        if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        if (!user && !userProfile) {
            toast.error('Please log in to place an order');
            openAuthModal('/checkout');
            return;
        }

        try {
            const orderData = {
                orderItems: checkoutItems.map((item) => ({
                    product: item.id,
                    name: item.name,
                    price: item.price.toString(),
                    quantity: item.quantity,
                    image: item.image,
                })),
                shippingInfo: {
                    fullName: formData.fullName,
                    address: formData.street,
                    city: formData.city,
                    phoneNo: formData.phone,
                    zipCode: formData.postalCode,
                    country: "India", // Default or you could add a field to the form
                },
                itemsPrice: subtotal,
                taxAmount: tax,
                shippingAmount: shippingCost,
                totalAmount: total,
                paymentMethod: paymentMethod === "cod" ? "COD" : "Online",
                orderNotes: formData.message,
            };

            const response = await createOrder(orderData).unwrap();

            setIsSubmitted(true);
            toast.success("Order placed successfully!");

            if (isBuyNow) {
                sessionStorage.removeItem('buyNowItem');
            } else {
                dispatch(clearCart());
            }

            // Redirect to profile page
            setTimeout(() => {
                router.push("/profile");
            }, 1500);
        } catch (error: any) {
            console.error("Order creation error:", error);
            toast.error(error?.data?.message || "Failed to place order. Please try again.");
        }
    };

    if (!authLoading && !user && !userProfile) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-6">
                <div className="text-center">
                    <h2 className="text-white text-2xl font-bold mb-4">Sign in to checkout</h2>
                    <p className="text-gray-400 mb-8">Please log in to your account to complete your purchase.</p>
                    <Link href="/auth/login">
                        <button className="px-8 py-3 bg-[#a87522] hover:bg-[#8e621d] text-white rounded-lg font-semibold transition-colors">
                            Sign In
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-20 pb-12">
            {/* Header */}
            <div className="pb-12 text-center border-b border-white/10">
                <h1 className="font-['Poppins'] font-medium text-[32px] md:text-[48px] text-white">
                    Order Summary
                </h1>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Back Button - Left Side */}
                <motion.button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[#a87522] hover:text-[#8e621d] mb-8 transition-colors group"
                    whileHover={{ x: -5 }}
                >
                    <ArrowLeft size={20} />
                    <span className="group-hover:underline">Back</span>
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2">
                        {/* Cart Items */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-[#1a1410] to-black border border-[#3a3027] rounded-2xl p-6 md:p-8 mb-8"
                        >
                            <h2 className="font-['Poppins'] font-semibold text-xl md:text-2xl text-white mb-6">
                                Order Items
                            </h2>

                            <div className="space-y-4">
                                {checkoutItems.map((item) => (
                                    <motion.div
                                        key={`${item.id}-${item.size}`}
                                        layout
                                        className="flex gap-4 p-4 bg-black/40 rounded-lg border border-[#3a3027] hover:border-[#a87522]/30 transition-colors"
                                    >
                                        {/* Product Image */}
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-black/60">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-white font-medium text-base md:text-lg mb-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-[#a87522] font-semibold">
                                                    ₹{item.price.toFixed(2)} each
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-gray-400 text-sm">
                                                    Qty: <span className="text-white font-medium">{item.quantity}</span>
                                                </div>
                                                <div className="text-white font-semibold">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Shipping Address */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-[#1a1410] to-black border border-[#3a3027] rounded-2xl p-6 md:p-8"
                        >
                            <h2 className="font-['Poppins'] font-semibold text-xl md:text-2xl text-white mb-6">
                                Shipping Address
                            </h2>

                            <form onSubmit={handleSubmitOrder} className="space-y-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 bg-black/40 border rounded-lg focus:outline-none transition-colors text-white placeholder-gray-500 ${errors.fullName
                                            ? 'border-red-500 focus:border-red-600'
                                            : 'border-[#3a3027] focus:border-[#a87522]'
                                            }`}
                                        placeholder="Your full name"
                                    />
                                    {errors.fullName && (
                                        <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 bg-black/40 border rounded-lg focus:outline-none transition-colors text-white placeholder-gray-500 ${errors.email
                                            ? 'border-red-500 focus:border-red-600'
                                            : 'border-[#3a3027] focus:border-[#a87522]'
                                            }`}
                                        placeholder="your@email.com"
                                    />
                                    {errors.email && (
                                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 bg-black/40 border rounded-lg focus:outline-none transition-colors text-white placeholder-gray-500 ${errors.phone
                                            ? 'border-red-500 focus:border-red-600'
                                            : 'border-[#3a3027] focus:border-[#a87522]'
                                            }`}
                                        placeholder="10-digit phone number"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Street Address */}
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 bg-black/40 border rounded-lg focus:outline-none transition-colors text-white placeholder-gray-500 ${errors.street
                                            ? 'border-red-500 focus:border-red-600'
                                            : 'border-[#3a3027] focus:border-[#a87522]'
                                            }`}
                                        placeholder="Street address"
                                    />
                                    {errors.street && (
                                        <p className="text-red-400 text-sm mt-1">{errors.street}</p>
                                    )}
                                </div>

                                {/* City */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 bg-black/40 border rounded-lg focus:outline-none transition-colors text-white placeholder-gray-500 ${errors.city
                                                ? 'border-red-500 focus:border-red-600'
                                                : 'border-[#3a3027] focus:border-[#a87522]'
                                                }`}
                                            placeholder="City"
                                        />
                                        {errors.city && (
                                            <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                                        )}
                                    </div>

                                    {/* Postal Code */}
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">
                                            Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 bg-black/40 border rounded-lg focus:outline-none transition-colors text-white placeholder-gray-500 ${errors.postalCode
                                                ? 'border-red-500 focus:border-red-600'
                                                : 'border-[#3a3027] focus:border-[#a87522]'
                                                }`}
                                            placeholder="Postal code"
                                        />
                                        {errors.postalCode && (
                                            <p className="text-red-400 text-sm mt-1">{errors.postalCode}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Special Instructions */}
                                {/* <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Special Instructions (Optional)
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-black/40 border border-[#3a3027] rounded-lg focus:outline-none focus:border-[#a87522] transition-colors text-white placeholder-gray-500"
                                        placeholder="Any special delivery instructions..."
                                    />
                                </div> */}

                                {/* Payment Method */}
                                <div className="pt-4">
                                    <label className="block text-gray-300 text-sm font-medium mb-4">
                                        Payment Method
                                    </label>
                                    <div className="space-y-3">
                                        <label className="flex items-center p-3 bg-black/40 border border-[#3a3027] rounded-lg cursor-pointer hover:border-[#a87522]/50 transition-colors">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={paymentMethod === 'cod'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <span className="ml-3 text-white font-medium">
                                                Cash on Delivery (COD)
                                            </span>
                                        </label>
                                        <label className="flex items-center p-3 bg-black/40 border border-[#3a3027] rounded-lg cursor-pointer hover:border-[#a87522]/50 transition-colors opacity-50">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="online"
                                                disabled
                                                className="w-4 h-4"
                                            />
                                            <span className="ml-3 text-gray-400 font-medium">
                                                Online Payment (Coming Soon)
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                    className="w-full mt-8 py-4 bg-gradient-to-r from-[#a87522] to-[#8e621d] hover:from-[#b89340] hover:to-[#a0731a] text-white font-['Poppins'] font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <span>Place Order</span>
                                    )}
                                </motion.button>
                            </form>
                        </motion.section>
                    </div>

                    {/* Order Summary - Right Side */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="sticky top-32 bg-gradient-to-br from-[#1a1410] to-black border border-[#3a3027] rounded-2xl p-6 md:p-8">
                            <h3 className="font-['Poppins'] font-semibold text-lg md:text-xl text-white mb-6">
                                Price Summary
                            </h3>

                            <div className="space-y-4 mb-6 pb-6 border-b border-[#3a3027]">
                                <div className="flex justify-between text-gray-300">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                {shippingCost > 0 && (
                                    <div className="flex justify-between text-gray-300">
                                        <span>Delivery Charge (COD)</span>
                                        <span>₹{shippingCost.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-white font-semibold text-lg">Total:</span>
                                <span className="text-[#a87522] font-bold text-2xl">
                                    ₹{total.toFixed(2)}
                                </span>
                            </div>

                            {/* Summary Info */}
                            <div className="bg-black/60 rounded-lg p-4 space-y-3 text-sm">
                                <div>
                                    <p className="text-gray-400">Items</p>
                                    <p className="text-white font-medium">
                                        {checkoutItems.length} {checkoutItems.length === 1 ? 'item' : 'items'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Delivery</p>
                                    <p className="text-white font-medium">
                                        {shippingCost > 0 ? 'COD Charge Applied' : 'Standard Delivery'}
                                    </p>
                                </div>
                                {subtotal > 600 && paymentMethod === 'cod' && (
                                    <p className="text-[#a87522] text-xs pt-2 border-t border-[#3a3027]">
                                        ₹50 COD charge added for orders above ₹600.
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
