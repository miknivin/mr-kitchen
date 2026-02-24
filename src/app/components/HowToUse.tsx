'use client';
import React, { useCallback, useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import imgApply from "../../assets/419f8e2ca2119256a91efcaca73ebfd464481ea4.png";
import imgScrub from "../../assets/0a15bd30151a4d08d55da10c27bd329d5f8cb036.png";
import imgRinse from "../../assets/031f680ac5cb9e42b293489f81c9e1791b17577e.png";
import { Reveal } from './Reveal';
import { motion } from 'motion/react';

const steps = [
  {
    id: 1,
    image: imgApply,
    title: "Apply",
    desc: "Add a small drop of Mr. Kitchen Charcoal Dishwash Gel onto a wet sponge."
  },
  {
    id: 2,
    image: imgScrub,
    title: "Scrub",
    desc: "Gently scrub utensils to lift grease and stubborn residue."
  },
  {
    id: 3,
    image: imgRinse,
    title: "Rinse",
    desc: "Rinse thoroughly with water for a sparkling clean finish."
  }
];

const StepCard = ({ step, index }: { step: typeof steps[0], index: number }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="relative w-full h-[420px] md:h-[520px] lg:h-[600px] xl:h-[680px] rounded-[25px] overflow-hidden group"
  >
    {/* Image */}
    <img
      src={typeof step.image === 'string' ? step.image : step.image.src}
      alt={step.title}
      className="absolute inset-0 w-full h-full object-cover rounded-[25px] transition-transform duration-700 group-hover:scale-110"
    />

    {/* Exact Gradient from Figma */}
    <div
      className="absolute inset-0 rounded-[25px]"
      style={{
        backgroundImage: "linear-gradient(178.943deg, rgba(0, 0, 0, 0) 17.414%, rgba(0, 0, 0, 0.43) 68.062%, rgb(0, 0, 0) 131.38%)"
      }}
    />

    {/* Content positioned to match Figma (approx top-[567px] relative to 753px height) */}
    <div className="absolute bottom-0 left-0 w-full px-[20px] pb-[30px] lg:pb-[50px] xl:pb-[70px] flex flex-col items-start text-left">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-['Poppins'] font-semibold text-[25px] text-[#e5e5e5] mb-2 leading-[35px]"
      >
        {step.title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-['Poppins'] font-regular text-[15px] lg:text-[17px] xl:text-[20px] text-[#e5e5e5]/75 leading-[24px] lg:leading-[28px] max-w-[280px] lg:max-w-[324px]"
      >
        {step.desc}
      </motion.p>
    </div>
  </motion.div>
);

export const HowToUse = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'center', containScroll: 'trimSnaps' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onInit = useCallback((api: any) => {
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = useCallback((api: any) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  return (
    <section className="bg-black py-12 lg:py-16 xl:py-20 px-4 md:px-8 lg:px-16 xl:px-[139px] flex flex-col items-center overflow-hidden">
      {/* Title */}
      <Reveal width="100%" className="text-center">
        <h2 className="font-['Poppins'] font-medium text-[32px] md:text-[50px] text-center mb-6">
          <span className="text-[#e5e5e5]">How to Use</span>
        </h2>
        <p className="font-['Poppins'] font-medium text-[16px] md:text-[25px] text-[#e5e5e5]/75 text-center max-w-[900px] mx-auto mb-12 leading-relaxed">
          Simple steps for a fast, spotless clean.
        </p>
      </Reveal>

      {/* Mobile Carousel */}
      <div className="md:hidden w-full relative">
        <div className="overflow-hidden rounded-[25px]" ref={emblaRef}>
          <div className="flex gap-4">
            {steps.map((step, index) => (
              <div className="flex-[0_0_85%] min-w-0 pl-4 relative" key={step.id}>
                <StepCard step={step} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots for Mobile */}
        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === selectedIndex ? 'bg-[#a87522] w-6' : 'bg-white/20 w-2'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 xl:gap-8 w-full max-w-[1400px]">
        {steps.map((step, index) => (
          <StepCard key={step.id} step={step} index={index} />
        ))}
      </div>
    </section>
  );
};
