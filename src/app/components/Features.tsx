'use client';
import React from 'react';
import imgSplash from "../../assets/d9acfe2435a859226e92c8ab61fe6beb16fd5daa.png";
import imgIconClean from "../../assets/1e6498d87fae685d41998d377aea11cdce8439bf.png";
import imgIconCharcoal from "../../assets/8f2008187db74671d9d5bbbb01e094474c189d5a.png";
import imgIconLemon from "../../assets/356e6093af1530f4936e2359d1eb4c21a84f0f74.png";
import { Reveal } from './Reveal';
import { motion } from 'motion/react';

const features = [
  {
    id: 1,
    icon: imgIconCharcoal,
    title: "Charcoal Purification",
    desc: "Activated charcoal locks onto oil and stubborn residue, lifting grease effortlessly for a deep hygienic clean."
  },
  {
    id: 2,
    icon: imgIconLemon,
    title: "Lemon Freshness",
    desc: "Natural citrus energy cuts through odor and leaves utensils sparkling with a fresh, clean scent."
  },
  {
    id: 3,
    icon: imgIconClean,
    title: "Clean & Gentle",
    desc: "Tough on stains, gentle on hands. Balanced formula designed for everyday safe use."
  }
];

export const Features = () => {
  return (
    <section className="relative w-full bg-black py-20 overflow-hidden min-h-[800px] flex flex-col justify-center">
      {/* Background/Splash Image - Restored to full size */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="w-full h-full lg:-translate-x-[25%] xl:-translate-x-[15%]"
        >
          <img
            src={typeof imgSplash === 'string' ? imgSplash : imgSplash.src}
            alt="Splash"
            className="w-full h-full object-cover object-left opacity-60 lg:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/40 hidden lg:block" />
        </motion.div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Header centered at the top */}
        <div className="flex flex-col items-center text-center mb-16 lg:mb-20">
          <Reveal>
            <h2 className="font-['Poppins'] font-medium text-[32px] md:text-[50px] leading-tight max-w-[900px]">
              <span className="text-white/75">The Power of </span>
              <span className="text-[#a87522] font-bold">Charcoal & </span>
              <span className="text-[#a87522] font-bold block md:inline">Lemon</span>
              <span className="text-white/75"> in Every Drop</span>
            </h2>
          </Reveal>

          <Reveal delay={0.4}>
            <p className="font-['Poppins'] font-medium text-[16px] md:text-[20px] text-white/75 max-w-[800px] mt-4 leading-relaxed">
              Engineered for modern kitchens, Mr. Kitchen delivers deep grease removal with refreshing citrus freshness in one premium formula.
            </p>
          </Reveal>
        </div>

        {/* Content Layout: Image area visual on left, Cards on right */}
        <div className="flex flex-col lg:flex-row">
          {/* Spacer for left side background image visibility - Increased to 45% to prevent overlap */}
          <div className="hidden lg:block lg:w-[40%] xl:w-[45%]" />

          {/* Right Side: Feature Cards */}
          <div className="w-full lg:w-[60%] xl:w-[55%] flex flex-col gap-6 lg:max-w-[600px]">
            {features.map((feature, i) => (
              <Reveal key={feature.id} delay={i * 0.2 + 0.6} width="100%">
                <motion.div
                  style={{ backgroundColor: "#4A2F03" }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(74, 47, 3, 0.6)" }}
                  className="backdrop-blur-md rounded-[30px] p-6 flex flex-row items-center gap-6 border border-white/5 shadow-xl transition-all duration-300 group"
                >
                  {/* Icon */}
                  <div className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] shrink-0 rounded-full bg-black/30 p-4 flex items-center justify-center group-hover:bg-[#a87522]/20 transition-colors overflow-hidden">
                    <img
                      src={typeof feature.icon === 'string' ? feature.icon : feature.icon.src}
                      alt={feature.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <h3 className="font-['Poppins'] font-semibold text-[20px] md:text-[24px] text-white mb-1 group-hover:text-[#a87522] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="font-['Poppins'] text-[14px] md:text-[16px] text-[#e5e5e5]/80 leading-snug">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
