"use client";

import React from "react";
import { motion } from "framer-motion";
import { Hammer, ChefHat, Clock } from "lucide-react";

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center relative overflow-hidden px-4 text-white font-sans">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-2xl"
      >
        <div className="flex justify-center mb-8 gap-4">
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <ChefHat size={48} className="text-orange-500" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Hammer size={48} className="text-amber-500" />
          </motion.div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
          Something's Cooking!
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-lg mx-auto">
          Our kitchen is getting a fresh upgrade. We're currently under maintenance to serve you better. We'll be back online shortly.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <Clock size={24} className="text-orange-500 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">ETA</h3>
            <p className="text-white font-medium">Coming Soon</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Status</h3>
            <p className="text-white font-medium">Improving UI</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <ChefHat size={24} className="text-orange-500 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Quality</h3>
            <p className="text-white font-medium">Top Tier</p>
          </motion.div>
        </div>

        <div className="inline-block px-1 pt-1 pb-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500">
          <div className="px-6 py-2 rounded-full bg-[#0f0f0f] text-sm md:text-base font-medium">
            Contact Support: support@mrkitchen.com
          </div>
        </div>
      </motion.div>

      {/* Decorative floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: i * 0.8
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  );
};

export default MaintenancePage;
