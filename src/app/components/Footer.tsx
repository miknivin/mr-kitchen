import React from 'react';
import Link from 'next/link';
import imgLogo from "../../assets/51d37928a4e84821bb0711e1775fb0ff23b4d0bd.png";


export const Footer = () => {
  return (
    <footer className="bg-[#4a2f03] py-8 md:py-12 px-6 lg:px-[139px] text-[#e5e5e5] font-['Inter']">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 mb-6 md:mb-10">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <div className="w-[100px] h-[45px] relative">
            <Link href="/">
              <img
                src={typeof imgLogo === 'string' ? imgLogo : imgLogo.src}
                alt="Mr. Kitchen"
                className="w-full h-full object-contain"
              />
            </Link>
          </div>
          <p className="font-['Poppins'] font-bold text-[18px] md:text-[22px]">Mr. Kitchen</p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h3 className="font-medium text-[18px] md:text-[20px] mb-2 text-white">Quick Links</h3>
          <div className="flex flex-col gap-1.5">
            <Link href="/" className="text-[14px] md:text-[16px] text-[#e5e5e5]/75 hover:text-white transition-colors">Home</Link>
            <Link href="/products" className="text-[14px] md:text-[16px] text-[#e5e5e5]/75 hover:text-white transition-colors">Products</Link>
            <Link href="/about" className="text-[14px] md:text-[16px] text-[#e5e5e5]/75 hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="text-[14px] md:text-[16px] text-[#e5e5e5]/75 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-2">
          <h3 className="font-medium text-[18px] md:text-[20px] mb-2 text-white">Support</h3>
          <div className="flex flex-col gap-1.5">
            <Link href="/help" className="text-[14px] md:text-[16px] text-[#e5e5e5]/75 hover:text-white transition-colors">Help Center</Link>
            <Link href="/shipping" className="text-[14px] md:text-[16px] text-[#e5e5e5]/75 hover:text-white transition-colors">Shipping Policy</Link>
            <Link href="/returns" className="text-[14px] md:text-[16px] text-[#e5e5e5]/75 hover:text-white transition-colors">Return Policy</Link>
            <Link href="/privacy" className="text-[14px] md:text-[16px] text-[#e5e5e5]/75 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[14px] md:text-[16px] text-[#e5e5e5]/75 hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/track" className="text-[14px] md:text-[16px] text-[#e5e5e5]/75 hover:text-white transition-colors">Track Order</Link>
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-2">
          <h3 className="font-medium text-[18px] md:text-[20px] mb-2 text-white">Contact</h3>
          <div className="text-[14px] md:text-[16px] text-[#e5e5e5]/75 leading-relaxed">
            <p>ACB Enterprises</p>
            <p>PARAPPANPOYIL (P.O),THAMARASSERY KOZHIKODE, KERALA</p>
            <p className="mt-1.5 text-[14px] md:text-[15px]">📧 acbenterprises16@gmail.com</p>
            <p className="text-[14px] md:text-[15px]">📞 +91 7025984447</p>
            <p className="mt-1.5 text-[14px] md:text-[15px]">Customer Care: Mon–Sat, 9AM–6PM</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#e5e5e5]/20 pt-4 text-center md:text-right">
        <p className="text-[12px] md:text-[15px] text-[#e5e5e5]/75">
          © 2026 Mr. Kitchen. All rights reserved. • Secure payments • Fast delivery • Safe formula
        </p>
      </div>
    </footer>


  );
};
