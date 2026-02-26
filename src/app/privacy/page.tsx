'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black pt-[120px] pb-20 overflow-x-hidden text-[#e5e5e5]">
            <div className="container mx-auto px-6 lg:px-[139px]">
                <Reveal width="100%" className="mb-12">
                    <h1 className="font-['Poppins'] font-medium text-[40px] md:text-[50px] text-white">Privacy Policy</h1>
                </Reveal>

                <div className="space-y-8 font-['Poppins'] text-[#e5e5e5]/80">
                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">1. Introduction</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            Welcome to Mr. Kitchen. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or purchase our products.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">2. Information We Collect</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            We collect information that you provide directly to us, such as when you create an account, place an order, or contact us. This may include your name, email address, phone number, shipping address, and payment details.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">3. How We Use Your Information</h2>
                        <ul className="list-disc ml-6 space-y-2 text-[16px] md:text-[18px]">
                            <li>To process and fulfill your orders.</li>
                            <li>To communicate with you regarding your orders or queries.</li>
                            <li>To improve our products and services.</li>
                            <li>To send you promotional offers and updates (with your consent).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">4. Data Security</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            We implement a variety of security measures to maintain the safety of your personal information. Your sensitive data is encrypted and stored securely.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">5. Contact Us</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at:
                            <br />
                            Email: acbenterprises16@gmail.com
                            <br />
                            Phone: +91 7025984447
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
