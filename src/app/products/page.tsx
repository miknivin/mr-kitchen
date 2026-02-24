'use client';
import React from 'react';
import { motion } from 'motion/react';
import { ProductGrid } from '../components/ProductGrid1';
import { Reveal } from '../components/Reveal';
import { Star } from 'lucide-react';
import imgP1 from "../../assets/product 1.png";

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-black">
            {/* Header Title */}
            <div className="pt-32 pb-10 text-center">
                <Reveal width="100%">
                    <h1 className="font-['Poppins'] font-medium text-[32px] md:text-[50px] text-white mb-6">
                        All Products
                    </h1>
                    <div className="w-full h-[1px] bg-white/20 max-w-[1240px] mx-auto" />
                </Reveal>
            </div>

            {/* Exclusive Offer Banner */}
            <section className="px-6 mb-20">
                <Reveal width="100%">
                    <div className="max-w-[1240px] mx-auto bg-[#e0e0e0] rounded-[40px] md:rounded-[70px] p-4 py-8 md:py-12 md:px-12 lg:py-10 lg:px-16 relative overflow-hidden flex flex-col gap-6 md:gap-12">
                        {/* Content Area */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
                            {/* Text Content */}
                            <div className="flex flex-col items-start gap-3 md:gap-6 z-10 w-full md:w-[45%] lg:w-[40%] max-w-[500px]">
                                <h2 className="font-['Poppins'] font-bold text-[32px] md:text-[42px] lg:text-[48px] leading-tight bg-gradient-to-r from-[#a87522] to-[#774b03] bg-clip-text text-transparent">
                                    Exclusive Offer
                                </h2>
                                <div className="font-['Poppins'] text-[18px] md:text-[22px] lg:text-[24px] text-black/80 leading-snug">
                                    <p>Get Mr. Kitchen Charcoal Dishwash Gel</p>
                                    <p className="font-bold">at 20% OFF</p>
                                </div>
                                <p className="font-['Poppins'] text-[14px] md:text-[18px] text-black/60">
                                    Limited time. Limited stock.
                                </p>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="mt-2 px-6 py-3 bg-[#a87522] hover:bg-[#8e621d] rounded-[15px] text-white font-['Poppins'] font-semibold text-[16px] md:text-[20px] shadow-lg transition-colors"
                                >
                                    Get 20% Off
                                </motion.button>
                            </div>

                            {/* Product Image */}
                            <div className="relative w-full md:w-[55%] lg:w-[60%] h-[180px] md:h-[350px] lg:h-[380px] flex items-center justify-center md:justify-end">
                                <motion.img
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    src={typeof imgP1 === 'string' ? imgP1 : imgP1.src}
                                    alt="Mr. Kitchen Charcoal Gel"
                                    className="h-full w-auto object-contain drop-shadow-2xl scale-125 md:scale-125 lg:scale-110"
                                />
                            </div>
                        </div>

                        {/* Feature List (Bottom of Card) */}
                        <div className="w-full text-center border-t border-black/5 pt-4">
                            <p className="font-['Poppins'] text-[12px] md:text-[16px] lg:text-[18px] text-black/60">
                                Safe on hands • Powerful cleaning • Fast delivery
                            </p>
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* Product Grid */}
            <ProductGrid />

            {/* Testimonial Section */}
            <section className="container mx-auto px-6 text-center py-20 mb-12">
                <Reveal width="100%">
                    <h2 className="font-['Poppins'] font-medium text-[32px] md:text-[50px] text-[#e5e5e5]/75 mb-16">
                        Loved by <span className="text-[#a87522]">Mr kitchen</span>
                    </h2>
                </Reveal>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative max-w-[1235px] mx-auto bg-gradient-to-r from-[#634007]/50 via-[#634007]/10 to-[#634007]/50 rounded-[70px] p-12 md:p-16 border border-[#634007]/30 backdrop-blur-sm"
                >
                    {/* Rating */}
                    <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#1a1205] px-6 py-2 rounded-full border border-[#a87522]/30 shadow-xl">
                        <Star className="w-6 h-6 fill-[#a87522] text-[#a87522]" />
                        <span className="font-['Poppins'] font-medium text-[20px] text-[#e5e5e5]/75">4.5</span>
                    </div>

                    <p className="font-['Poppins'] font-medium text-[20px] md:text-[25px] text-[#e5e5e5]/75 leading-relaxed mb-8">
                        “Removes oil in seconds. I use less gel and still get better results.”
                    </p>

                    <p className="font-['Poppins'] font-medium text-[20px] md:text-[25px] text-[#e5e5e5]/75">
                        — Ayesha K.
                    </p>
                </motion.div>
            </section>
        </div>
    );
}
