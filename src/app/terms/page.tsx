'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-black pt-[120px] pb-20 overflow-x-hidden text-[#e5e5e5]">
            <div className="container mx-auto px-6 lg:px-[139px]">
                <Reveal width="100%" className="mb-12">
                    <h1 className="font-['Poppins'] font-medium text-[40px] md:text-[50px] text-white">Terms & Conditions</h1>
                </Reveal>

                <div className="space-y-8 font-['Poppins'] text-[#e5e5e5]/80">
                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            By accessing and using the Mr. Kitchen website, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please refrain from using our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">2. Product Information</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            We strive to ensure that all product information, descriptions, and prices are accurate. However, errors may occur. We reserve the right to correct any errors and change information at any time without prior notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">3. Orders and Payments</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            All orders are subject to acceptance and availability. Payments must be made through our authorized payment gateways. We reserve the right to cancel any order in case of payment failure or suspicious activity.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">4. Intellectual Property</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            All content on this website, including text, graphics, logos, and images, is the property of ACB Enterprises and is protected by intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">5. Governing Law</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Kerala.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
