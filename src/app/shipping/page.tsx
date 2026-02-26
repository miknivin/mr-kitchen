'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Reveal } from '../components/Reveal';

export default function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-black pt-[120px] pb-20 overflow-x-hidden text-[#e5e5e5]">
            <div className="container mx-auto px-6 lg:px-[139px]">
                <Reveal width="100%" className="mb-12">
                    <h1 className="font-['Poppins'] font-medium text-[40px] md:text-[50px] text-white">Shipping Policy</h1>
                </Reveal>

                <div className="space-y-8 font-['Poppins'] text-[#e5e5e5]/80">
                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">1. Shipping Coverage</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            We currently ship our products to most locations across India. We are working on expanding our delivery network to serve you better.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">2. Processing Time</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            Orders are typically processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">3. Delivery Estimates</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            Once shipped, delivery usually takes 3-7 business days depending on your location. Please note that delivery times may vary due to external factors like weather conditions or courier delays.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">4. Shipping Charges</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            Shipping charges are calculated based on the weight of your order and the delivery location. The final shipping cost will be displayed at checkout.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-[24px] font-semibold text-white mb-4">5. Order Tracking</h2>
                        <p className="text-[16px] md:text-[18px] leading-relaxed">
                            Once your order is dispatched, you will receive a tracking ID via email or SMS to monitor your shipment's progress.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
