'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';

const FeaturePill = ({ text, delay }: { text: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        whileHover={{ scale: 1.05 }}
        className="bg-[#d9d9d9] w-full md:w-[577px] min-h-[52px] py-2 md:py-0 rounded-[25px] flex items-center justify-center shadow-lg hover:bg-white transition-colors"
    >
        <span className="font-['Poppins'] font-medium text-[20px] md:text-[25px] text-black text-center px-4 leading-tight">{text}</span>
    </motion.div>
);

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black pt-[100px] pb-20 overflow-x-hidden text-[#e5e5e5]">
            {/* Title */}
            <Reveal width="100%" className="text-center mb-16">
                <h1 className="font-['Poppins'] font-medium text-[40px] md:text-[50px]">About Us</h1>
            </Reveal>

            {/* Our History Section */}
            <section className="container mx-auto px-6 lg:px-[139px] mb-24">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-20">
                    <div className="md:w-1/4 shrink-0">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="font-['Poppins'] font-medium text-[28px] md:text-[32px] text-[#e5e5e5]/75 text-center md:text-left"
                        >
                            Our History
                        </motion.h2>
                    </div>
                    <div className="md:w-3/4">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-['Poppins'] font-normal text-[16px] md:text-[20px] leading-relaxed text-[#e5e5e5] text-left"
                        >
                            The journey of ACB Group from its humble beginnings to a well-established organization with a number of popular and quality products in its fold has been eventful, with the timeline marked by steady growth. Throughout this journey and in different ventures, ACB Group upheld quality and commitment, thus nurturing the trust and goodwill of its thousands of customers, dealers, and distributors.
                            <br /><br />
                            The origin of ACB Group can be traced back to the year 2004, when two dedicated and insightful entrepreneurs, A. C. Mohammed and A. C. Jabir, decided to tread new paths. They came up with a venture which was unheard of at that time: the branding and marketing of dry fish. Till that time, dry fish used to be stored in unhygienic conditions and it was difficult to trace the producers.
                            <br /><br />
                            The new venture of ACB Group changed this situation. Well-processed and cleaned dry fish reached the customers in neat packages with a brand name. The business mainly concentrated on the rural areas of Kerala.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Our Mission Section */}
            <section className="relative w-full bg-[#8c6119] py-24 mb-24 overflow-hidden">
                <div className="container mx-auto px-6 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-[#d9d9d9] px-12 py-3 rounded-[50px] mb-8"
                    >
                        <span className="font-['Poppins'] font-semibold text-[25px] md:text-[35px] text-black/75">Our Mission</span>
                    </motion.div>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="font-['Poppins'] font-medium text-[20px] md:text-[25px] text-white max-w-[1015px] leading-relaxed"
                    >
                        To make premium cleaning accessible to every home by combining innovation, safety, and performance in every bottle.
                    </motion.p>
                </div>
            </section>

            {/* Why Choose Section */}
            <section className="container mx-auto px-6 lg:px-[139px] mb-24">
                <Reveal width="100%" className="text-center mb-16">
                    <h2 className="font-['Poppins'] font-medium text-[35px] md:text-[50px] text-[#e5e5e5]/75">
                        Why Choose <span className="bg-gradient-to-r from-[#4a2f03] via-[#aa7722] to-[#cc973f] bg-clip-text text-transparent">Mr kitchen</span>
                    </h2>
                </Reveal>

                <div className="flex flex-col items-center gap-6 md:gap-12 max-w-[1300px] mx-auto">
                    {/* Row 1 */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full justify-center">
                        <FeaturePill text="Advanced charcoal purification" delay={0.1} />
                        <FeaturePill text="Gentle on hands" delay={0.2} />
                    </div>
                    {/* Row 2 */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full justify-center">
                        <FeaturePill text="Fresh lemon finish" delay={0.3} />
                        <FeaturePill text="Premium quality formula" delay={0.4} />
                    </div>
                    {/* Row 3 */}
                    <div className="flex justify-center w-full">
                        <FeaturePill text="Designed for modern homes" delay={0.5} />
                    </div>
                </div>
            </section>
        </div>
    );
};
