'use client';
import React from 'react';
import imgHeroBg from "../../assets/50b8426ae2889868fd247d064b86682d37b66aeb.png";
import { motion } from 'motion/react';
import Link from 'next/link';

export const Hero = () => {
  return (
    <section className="hero-section">
      {/* Background Image & Overlays */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="hero-bg"
      >
        <img
          src={typeof imgHeroBg === 'string' ? imgHeroBg : imgHeroBg.src}
          alt="Hero Background"
        />
      </motion.div>

      <div className="hero-content">
        {/* Gradient Text */}
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span>Deep Clean</span>
          <br />
          <span>Fresh Finish</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Charcoal-powered dishwash gel with refreshing lemon energy for modern kitchens.
        </motion.p>

        {/* CTA Button */}
        <Link href="/products">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hero-cta"
          >
            <span>Shop Now</span>
          </motion.button>
        </Link>
      </div>
    </section>
  );
};
