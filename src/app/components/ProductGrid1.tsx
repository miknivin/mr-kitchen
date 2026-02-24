'use client';
import React, { useCallback, useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Reveal } from './Reveal';
import { motion } from 'motion/react';
import { useGetProductsQuery } from '@/redux/api/productApi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Variant {
    size: string;
    price: number;
    discountPrice: number;
    stockQuantity: number;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    shortDescription?: string;
    price: number;
    images: Array<{ url: string; public_id?: string }>;
    ratings?: number;
    variants?: Variant[];
}

const ProductCard = ({ product }: { product: Product }) => {
    // Calculate correct display price from variants
    const displayPrice = (() => {
        if (product.variants && product.variants.length > 0) {
            const prices = product.variants.map(v =>
                v.discountPrice > 0 ? v.discountPrice : v.price
            );
            return Math.min(...prices);
        }
        return typeof product.price === 'number' ? product.price : 0;
    })();

    const hasDiscount = product.variants && product.variants.length > 0 &&
        product.variants.some(v => v.discountPrice > 0 && v.discountPrice < v.price);

    const originalPrice = hasDiscount && product.variants
        ? Math.min(...product.variants.map(v => v.price))
        : null;

    return (
        <Link href={`/products/${product._id}`}>
            <motion.div
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center w-full max-w-[280px] md:max-w-[280px] mx-auto p-4 md:p-5 rounded-[20px] bg-[#e0e0e0] shadow-2xl transition-all duration-300 cursor-pointer h-full"
            >
                {/* Product Image */}
                <div className="h-[160px] md:h-[180px] flex items-center justify-center mb-2 relative group w-full">
                    {product.images && product.images[0] ? (
                        <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-full w-full object-contain drop-shadow-lg relative z-10 transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-300 flex items-center justify-center text-gray-600">
                            No Image
                        </div>
                    )}
                </div>

                {/* Product Name */}
                <h3 className="font-['Poppins'] font-bold text-[18px] md:text-[20px] text-black mb-0.5 line-clamp-2">
                    {product.name}
                </h3>

                {/* Short Description */}
                <p className="font-['Poppins'] font-medium text-[12px] md:text-[13px] text-black/70 mb-3 min-h-[32px] leading-tight line-clamp-2">
                    {product.shortDescription || product.description}
                </p>

                {/* Product Price */}
                <div className="flex items-baseline justify-center gap-2 mb-4">
                    <p className="font-['Poppins'] font-bold text-[18px] md:text-[20px] text-[#a87522]">
                        ₹{displayPrice.toFixed(2)}
                    </p>
                    {originalPrice && originalPrice > displayPrice && (
                        <p className="font-['Poppins'] text-[13px] text-black/40 line-through">
                            ₹{originalPrice.toFixed(2)}
                        </p>
                    )}
                </div>

                {/* Shop Now Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="relative w-full h-[40px] md:h-[45px] rounded-[12px] md:rounded-[15px] overflow-hidden group shadow-lg shadow-[#a87522]/30"
                >
                    <div className="absolute inset-0 bg-[#a87522] hover:bg-[#8e621d] transition-all duration-300" />
                    <span className="relative z-10 font-['Poppins'] font-bold text-[15px] md:text-[17px] text-white flex items-center justify-center h-full">
                        View Details
                    </span>
                </motion.button>
            </motion.div>
        </Link>
    );
};

export const ProductGrid = () => {
    const { data, isLoading, error } = useGetProductsQuery({});
    const products = data?.products || [];

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', containScroll: 'trimSnaps' });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onInit = useCallback((api: any) => {
        setScrollSnaps(api.scrollSnapList());
    }, []);

    const onSelect = useCallback((api: any) => {
        setSelectedIndex(api.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onInit(emblaApi);
        onSelect(emblaApi);
        emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
    }, [emblaApi, onInit, onSelect]);

    const scrollTo = useCallback(
        (index: number) => emblaApi && emblaApi.scrollTo(index),
        [emblaApi]
    );

    // Loading State
    if (isLoading) {
        return (
            <section className="bg-black py-10 px-6 md:px-12 lg:px-[139px] overflow-hidden">
                <div className="flex justify-center items-center h-96">
                    <div className="text-white text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#a87522]"></div>
                        <p className="mt-4 font-['Poppins']">Loading products...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Error State
    if (error) {
        return (
            <section className="bg-black py-10 px-6 md:px-12 lg:px-[139px] overflow-hidden">
                <div className="flex justify-center items-center h-96">
                    <div className="text-white text-center">
                        <p className="font-['Poppins'] text-red-400">Failed to load products. Please try again.</p>
                    </div>
                </div>
            </section>
        );
    }

    // Empty State
    if (!products || products.length === 0) {
        return (
            <section className="bg-black py-10 px-6 md:px-12 lg:px-[139px] overflow-hidden">
                <div className="flex justify-center items-center h-96">
                    <div className="text-white text-center">
                        <p className="font-['Poppins']">No products found.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-black py-10 px-6 md:px-12 lg:px-[139px] overflow-hidden">
            <Reveal width="100%">
                {/* Mobile Carousel */}
                <div className="md:hidden relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-4">
                            {products.map((product: Product) => (
                                <div className="flex-[0_0_85%] min-w-0 pl-4" key={product._id}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination Dots for Mobile */}
                    <div className="flex justify-center gap-2 mt-8">
                        {scrollSnaps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollTo(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === selectedIndex ? 'bg-[#a87522] w-6' : 'bg-white/20 w-2'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 xl:gap-y-16 justify-items-center w-full">
                    {products.map((product: Product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </Reveal>
        </section>
    );
};

