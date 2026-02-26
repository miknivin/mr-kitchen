'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';
import Link from 'next/link';

export default function HelpCenter() {
    const faqs = [
        {
            question: "How can I track my order?",
            answer: "You can track your order by visiting the 'My Orders' section in your profile. Once your order is shipped, you will also receive a tracking ID via email."
        },
        {
            question: "What are the shipping charges?",
            answer: "Shipping charges are calculated based on the weight of your order and the delivery location. You can see the final shipping cost at checkout."
        },
        {
            question: "How do I return a product?",
            answer: "If you receive a damaged or incorrect product, please contact us within 7 days. Check our Return Policy for more details."
        },
        {
            question: "Is it safe to use Mr. Kitchen products?",
            answer: "Yes, our products are formulated with safety and performance in mind. They are designed to be effective yet gentle for home use."
        }
    ];

    return (
        <div className="min-h-screen bg-black pt-[120px] pb-20 overflow-x-hidden text-[#e5e5e5]">
            <div className="container mx-auto px-6 lg:px-[139px]">
                <Reveal width="100%" className="mb-12">
                    <h1 className="font-['Poppins'] font-medium text-[40px] md:text-[50px] text-white">Help Center</h1>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-['Poppins']">
                    <div className="space-y-8">
                        <h2 className="text-[28px] font-semibold text-white">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="border-b border-white/10 pb-6"
                                >
                                    <h3 className="text-[20px] font-medium text-white mb-2">{faq.question}</h3>
                                    <p className="text-[16px] text-[#e5e5e5]/70 leading-relaxed">{faq.answer}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#bd7400]/10 border border-[#a87522]/30 rounded-[30px] p-8 h-fit">
                        <h2 className="text-[28px] font-semibold text-white mb-6">Still need help?</h2>
                        <p className="text-[18px] text-[#e5e5e5]/80 mb-8 leading-relaxed">
                            Our customer support team is here to assist you with any queries or concerns you may have.
                        </p>
                        <Link href="/contact" className="inline-block bg-gradient-to-r from-[#a87522] to-[#774b03] px-8 py-3 rounded-[20px] font-semibold text-white hover:scale-105 transition-transform">
                            Contact Us
                        </Link>

                        <div className="mt-10 space-y-4 text-[16px] text-[#e5e5e5]/70">
                            <p>📧 acbenterprises16@gmail.com</p>
                            <p>📞 +91 7025984447</p>
                            <p>⏰ Mon–Sat, 9AM–6PM</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
