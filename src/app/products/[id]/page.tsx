'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetProductDetailsQuery } from '@/redux/api/productApi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { RootState } from '@/redux/store';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, Star, Plus, Minus, Zap } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useGetMeQuery } from '@/redux/api/userApi';
import { useAuthModal } from '@/context/AuthModalContext';

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [variantError, setVariantError] = useState(false);

    // Auto-select the first variant when product changes
    useEffect(() => {
        if (product && product.variants && product.variants.length > 0) {
            setSelectedVariant(product.variants[0]);
        } else {
            setSelectedVariant(null);
        }
        setVariantError(false);
    }, [product]);
    const dispatch = useDispatch();
    const { data: user } = useGetMeQuery(undefined);
    const { openAuthModal } = useAuthModal();

    const handleAddToCart = () => {
        if (!product) return;

        // If product has variants, one must be selected
        if (product.variants && product.variants.length > 0 && !selectedVariant) {
            toast.error('Please select a variant before adding to cart!');
            setVariantError(true);
            setTimeout(() => setVariantError(false), 1000);
            return;
        }

        const displayPrice = selectedVariant
            ? (selectedVariant.discountPrice > 0 ? selectedVariant.discountPrice : selectedVariant.price)
            : product.price;

        const itemImage = (selectedVariant?.imageUrl && selectedVariant.imageUrl.length > 0)
            ? selectedVariant.imageUrl[0]
            : (product.images?.[0]?.url || '');

        const cartItem = {
            id: product._id,
            name: `${product.name}${selectedVariant ? ` (${selectedVariant.size})` : ''}`,
            price: displayPrice,
            quantity: quantity,
            image: itemImage,
            size: selectedVariant?.size,
        };

        dispatch(addToCart(cartItem));
        toast.success(`${product.name}${selectedVariant ? ` (${selectedVariant.size})` : ''} added to cart!`);
        setQuantity(1);
    };

    const handleBuyNow = () => {
        if (!product) return;

        // If product has variants, one must be selected
        if (product.variants && product.variants.length > 0 && !selectedVariant) {
            toast.error('Please select a variant to continue!');
            setVariantError(true);
            setTimeout(() => setVariantError(false), 1000);
            return;
        }

        if (!user) {
            toast.error('Please login to proceed to checkout');
            openAuthModal('/checkout');
            return;
        }

        const displayPrice = selectedVariant
            ? (selectedVariant.discountPrice > 0 ? selectedVariant.discountPrice : selectedVariant.price)
            : product.price;

        const itemImage = (selectedVariant?.imageUrl && selectedVariant.imageUrl.length > 0)
            ? selectedVariant.imageUrl[0]
            : (product.images?.[0]?.url || '');

        const buyNowItem = {
            id: product._id,
            name: `${product.name}${selectedVariant ? ` (${selectedVariant.size})` : ''}`,
            price: displayPrice,
            quantity: quantity,
            image: itemImage,
            size: selectedVariant?.size,
        };

        // Use sessionStorage instead of Redux cart for Buy Now
        sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
        router.push('/checkout');
    };

    const handleQuantityChange = (value: number) => {
        const currentStock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
        const maxQuantity = currentStock && currentStock > 0 ? currentStock : 999;
        if (value > 0 && value <= maxQuantity) {
            setQuantity(value);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center pt-20">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#a87522]"></div>
                    <p className="mt-4 text-white font-['Poppins']">Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center pt-20">
                <div className="text-center">
                    <p className="text-white font-['Poppins'] text-lg mb-6">Product not found</p>
                    <Link href="/products">
                        <button className="px-6 py-3 bg-[#a87522] hover:bg-[#8e621d] text-white rounded-lg font-semibold transition-colors">
                            Back to Products
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const rating = product.ratings || 0;
    const hasMultipleImages = product.images && product.images.length > 1;
    // If stockQuantity field doesn't exist or is undefined, default to available (true)
    const inStock = (product.stockQuantity === 0) ? false : true;

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

            {/* Product Details */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Images - Left Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-4"
                    >
                        {/* Main Image */}
                        <div className="relative bg-gradient-to-br from-[#1a1410] to-black border border-[#3a3027] rounded-2xl p-8 flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
                            {product.images && product.images[selectedImageIndex] ? (
                                <img
                                    src={product.images[selectedImageIndex].url}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <div className="text-gray-400 text-center">
                                    <p>No image available</p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {hasMultipleImages && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {product.images.map((image, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        whileHover={{ scale: 1.05 }}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${index === selectedImageIndex
                                            ? 'border-[#a87522]'
                                            : 'border-[#3a3027]'
                                            }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`${product.name} - ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info - Right Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col justify-between"
                    >
                        {/* Header Info */}
                        <div>
                            {/* Category Badge */}
                            <div className="mb-4">
                                <span className="inline-block px-4 py-1 bg-[#a87522]/10 border border-[#a87522]/30 text-[#a87522] text-sm font-['Poppins'] rounded-full">
                                    {product.category || 'Product'}
                                </span>
                            </div>

                            {/* Product Name */}
                            <h1 className="font-['Poppins'] font-bold text-[32px] md:text-[42px] text-white mb-4 leading-tight">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            {/* <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={
                                                i < Math.floor(rating)
                                                    ? 'fill-[#a87522] text-[#a87522]'
                                                    : 'text-gray-600'
                                            }
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-400 text-sm">
                                    {rating.toFixed(1)} ({product.numOfReviews || 0} reviews)
                                </span>
                            </div> */}

                            {/* Price */}
                            <div className="mb-6 pb-6 border-b border-[#3a3027]">
                                <p className="text-gray-400 text-sm mb-2">Price</p>
                                <div className="flex items-baseline gap-3">
                                    <p className="font-['Poppins'] font-bold text-[32px] text-[#a87522]">
                                        ₹{(selectedVariant
                                            ? (selectedVariant.discountPrice > 0 ? selectedVariant.discountPrice : selectedVariant.price)
                                            : (typeof product.price === 'number' ? product.price : 0)).toFixed(2)}
                                    </p>
                                    {selectedVariant?.discountPrice > 0 && selectedVariant.price > selectedVariant.discountPrice && (
                                        <p className="text-gray-500 line-through text-lg font-['Poppins']">
                                            ₹{selectedVariant.price.toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Variant Selector */}
                            {product.variants && product.variants.length > 0 && (
                                <div className={`mb-6 pb-6 border-b transition-all duration-300 ${variantError ? 'border-red-500' : 'border-[#3a3027]'
                                    }`}>
                                    <p className={`text-sm mb-3 font-['Poppins'] transition-colors ${variantError ? 'text-red-400 font-semibold' : 'text-gray-400'
                                        }`}>
                                        {variantError ? '⚠️ Please select a variant' : 'Select Variant'}
                                    </p>
                                    <motion.div
                                        animate={variantError ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                                        transition={{ duration: 0.4 }}
                                        className="flex flex-wrap gap-3"
                                    >
                                        {product.variants.map((variant: any, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => { setSelectedVariant(variant); setVariantError(false); }}
                                                className={`px-4 py-2 rounded-lg font-['Poppins'] text-sm transition-all border ${selectedVariant?.size === variant.size
                                                    ? 'bg-[#a87522] text-white border-[#a87522]'
                                                    : variantError
                                                        ? 'bg-black/40 text-red-400 border-red-500/50 hover:border-red-400'
                                                        : 'bg-black/40 text-gray-400 border-[#3a3027] hover:border-[#a87522]/50'
                                                    }`}
                                            >
                                                {variant.size}
                                            </button>
                                        ))}
                                    </motion.div>
                                </div>
                            )}

                            {/* Short Description */}
                            {product.shortDescription && (
                                <div className="mb-6 pb-6 border-b border-[#3a3027]">
                                    <p className="text-gray-400 text-sm mb-2">Overview</p>
                                    <p className="text-gray-300 font-['Poppins'] leading-relaxed text-sm">
                                        {product.shortDescription}
                                    </p>
                                </div>
                            )}

                            {/* Description */}
                            <div className="mb-6 pb-6 border-b border-[#3a3027]">
                                <p className="text-gray-400 text-sm mb-2">Description</p>
                                <p className="text-gray-300 font-['Poppins'] leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Features */}
                            {product.features && product.features.length > 0 && (
                                <div className="mb-6 pb-6 border-b border-[#3a3027]">
                                    <p className="text-gray-400 text-sm mb-3">Key Features</p>
                                    <ul className="space-y-2">
                                        {product.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2 text-gray-300">
                                                <span className="text-[#a87522] mt-1">•</span>
                                                <span className="font-['Poppins'] text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Stock Status */}
                            {/* <div className="mb-6">
                                <p className="text-gray-400 text-sm mb-2">Availability</p>
                                <p className={`font-['Poppins'] font-semibold ${inStock ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {product.stockQuantity === 0
                                        ? 'Out of stock'
                                        : product.stockQuantity > 0
                                            ? `${product.stockQuantity} in stock`
                                            : 'Available'}
                                </p>
                            </div> */}
                        </div>

                        {/* Quantity and Add to Cart */}
                        <div className="space-y-4">
                            {/* Quantity Selector */}
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-3">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-3 border border-[#3a3027] rounded-lg p-3 bg-black/40 w-max">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        className="p-1 hover:bg-[#a87522]/20 rounded transition-colors"
                                    >
                                        <Minus size={18} className="text-[#a87522]" />
                                    </motion.button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                        className="w-12 text-center bg-transparent text-white font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        min="1"
                                    />
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="p-1 hover:bg-[#a87522]/20 rounded transition-colors"
                                    >
                                        <Plus size={18} className="text-[#a87522]" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <motion.button
                                onClick={handleAddToCart}
                                disabled={!inStock}
                                whileHover={{ scale: inStock ? 1.02 : 1 }}
                                whileTap={{ scale: inStock ? 0.98 : 1 }}
                                className={`w-full py-4 rounded-lg font-['Poppins'] font-semibold text-lg flex items-center justify-center gap-3 transition-all ${inStock
                                    ? 'bg-gradient-to-r from-[#a87522] to-[#8e621d] hover:from-[#b89340] hover:to-[#a0731a] text-white'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <ShoppingCart size={22} />
                                {inStock ? 'Add to Cart' : 'Out of Stock'}
                            </motion.button>

                            {/* Buy Now Button */}
                            <motion.button
                                onClick={handleBuyNow}
                                disabled={!inStock}
                                whileHover={{ scale: inStock ? 1.02 : 1 }}
                                whileTap={{ scale: inStock ? 0.98 : 1 }}
                                className={`w-full py-3 rounded-lg font-['Poppins'] font-semibold flex items-center justify-center gap-3 transition-all border ${inStock
                                    ? 'border-[#a87522] text-[#a87522] hover:bg-[#a87522]/10'
                                    : 'border-gray-600 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <Zap size={20} />
                                Buy Now
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Product Details Sections */}
                {product.reviews && product.reviews.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-16 bg-gradient-to-br from-[#1a1410] to-black border border-[#3a3027] rounded-2xl p-8"
                    >
                        <h2 className="font-['Poppins'] font-bold text-2xl text-white mb-6">
                            Customer Reviews
                        </h2>
                        <div className="space-y-4">
                            {product.reviews.map((review: any, index: number) => (
                                <div key={index} className="border-l-2 border-[#a87522] pl-4 py-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-white">{review.name}</span>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={
                                                        i < review.rating
                                                            ? 'fill-[#a87522] text-[#a87522]'
                                                            : 'text-gray-600'
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
