'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';

export default function ReturnPolicy() {
    return (
        <div className="min-h-screen bg-black pt-[120px] pb-20 overflow-x-hidden text-[#e5e5e5]">
            <div className="container mx-auto px-6 lg:px-[139px]">
                <Reveal width="100%" className="mb-12">
                    <h1 className="font-['Poppins'] font-medium text-[40px] md:text-[50px] text-white">Return Policy</h1>
                </Reveal>

                <div className="space-y-8 font-['Poppins'] text-[#e5e5e5]/80">
                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">1. Return Window</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            We offer a 7-day return policy. If you receive a damaged or incorrect product, you must notify us within 7 days of delivery to be eligible for a return or replacement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">2. Eligibility for Returns</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            To be eligible for a return, the product must be unused, in the same condition that you received it, and in its original packaging. Proof of purchase is required.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">3. Non-Returnable Items</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            Opened or used cleaning products cannot be returned for hygiene and safety reasons, unless they are defective or damaged upon delivery.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">4. Refund Process</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed to your original payment method within 5-7 business days.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">5. Contact for Returns</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            To initiate a return, please contact our customer support at acbenterprises16@gmail.com with your order details.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
