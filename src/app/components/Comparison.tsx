'use client';
import React from 'react';
import imgScrub1 from "../../assets/scrub 1.png";
import imgScrub2 from "../../assets/scrub 2.png";
import { Reveal } from './Reveal';
import { motion } from 'motion/react';

export const Comparison = () => {
  return (
    <section className="bg-black py-20 px-6 lg:px-[139px] text-center overflow-hidden">
      <div className="container mx-auto">
        {/* Title */}
        <Reveal width="100%">
          <h2 className="font-['Poppins'] font-medium text-[32px] md:text-[50px] mb-6">
            <span className="text-[#e5e5e5]/75">See the Difference</span>
            <span className="text-[#e5e5e5] block md:inline"> After One Wash </span>
          </h2>
        </Reveal>

        <Reveal delay={0.4} width="100%">
          <p className="font-['Poppins'] font-medium text-[16px] md:text-[25px] text-[#e5e5e5]/75 max-w-[900px] mx-auto mb-20 leading-relaxed">
            Our charcoal-powered formula breaks down grease instantly, leaving utensils cleaner with less effort.
          </p>
        </Reveal>

        {/* Comparison Grid */}
        <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-20 items-center md:items-start">
          {/* Ordinary */}
          <Reveal delay={0.2} className="w-full md:w-auto">
            <div className="flex flex-col items-center max-w-[400px] mx-auto">
              <div className="relative w-[250px] h-[250px] md:w-[300px] md:h-[300px] mb-8 flex items-center justify-center">
                {/* Single Circle Background */}
                <div className="absolute inset-0 rounded-full bg-[#4A2F03]" />
                {/* Image directly in the circle */}
                <img
                  src={typeof imgScrub2 === 'string' ? imgScrub2 : imgScrub2.src}
                  alt="Ordinary Scrub"
                  className="relative z-10 w-[70%] h-auto object-contain opacity-90 transition-opacity drop-shadow-xl"
                />
              </div>
              <h3 className="font-['Poppins'] font-semibold text-[22px] md:text-[25px] text-[#e5e5e5] mb-4">
                Ordinary Dishwash Gel
              </h3>
              <p className="font-['Poppins'] font-regular text-[16px] md:text-[20px] text-[#e5e5e5]/75">
                Struggles with stubborn oil and leaves residue behind.
              </p>
            </div>
          </Reveal>

          {/* Mr Kitchen */}
          <Reveal delay={0.4} className="w-full md:w-auto">
            <div className="flex flex-col items-center max-w-[400px] mx-auto">
              <div className="relative w-[250px] h-[250px] md:w-[300px] md:h-[300px] mb-8 flex items-center justify-center">
                {/* Single Circle Background */}
                <div className="absolute inset-0 rounded-full bg-[#4A2F03]" />
                {/* Image directly in the circle */}
                <img
                  src={typeof imgScrub1 === 'string' ? imgScrub1 : imgScrub1.src}
                  alt="Mr. Kitchen Scrub"
                  className="relative z-10 w-[70%] h-auto object-contain grayscale-0 brightness-105 contrast-110 drop-shadow-2xl"
                />
              </div>
              <h3 className="font-['Poppins'] font-semibold text-[22px] md:text-[25px] text-[#a87522] mb-4">
                Mr. Kitchen Charcoal Gel
              </h3>
              <p className="font-['Poppins'] font-regular text-[16px] md:text-[20px] text-[#e5e5e5]/75">
                Cuts grease fast for a spotless, fresh finish.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
