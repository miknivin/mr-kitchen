'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import imgLogo from "../../assets/51d37928a4e84821bb0711e1775fb0ff23b4d0bd.png";
import { IconPaths } from '../utils/icons';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthModal } from './AuthModal';
import { useGetMeQuery } from '@/redux/api/userApi';
import { useAuthModal } from '@/context/AuthModalContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { hydrateCart } from '@/redux/slices/cartSlice';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { data: user } = useGetMeQuery(undefined);
  const { isAuthModalOpen, openAuthModal, closeAuthModal } = useAuthModal();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Rehydrate cart from localStorage after client mount (prevents hydration mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mrkitchen_cart');
      if (saved) {
        dispatch(hydrateCart(JSON.parse(saved)));
      }
    } catch { }
    setMounted(true);
  }, [dispatch]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-50 pt-[20px] xl:pt-[40px] px-6 xl:px-[139px]">
        <div className="flex items-center justify-between h-[50px]">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-[80px] xl:w-[100px] h-[40px] xl:h-[50px] relative shrink-0"
          >
            <Link href="/">
              <img
                src={typeof imgLogo === 'string' ? imgLogo : imgLogo.src}
                alt="Mr. Kitchen"
                className="w-full h-full object-contain"
              />
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-[50px] ml-16">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={item.path}
                  className={`font-['Poppins'] font-semibold text-[25px] transition-colors ${pathname === item.path ? 'text-[#986718]' : 'text-[#e5e5e5]/75 hover:text-[#986718]'}`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden xl:flex items-center gap-4 ml-8"
          >
            {/* Search Bar - Expandable (Pushes content instead of overlapping) */}
            <motion.div
              initial="initial"
              whileHover="expanded"
              animate="initial"
              className="h-[44px] flex items-center"
            >
              <motion.div
                variants={{
                  initial: { width: 44 },
                  expanded: { width: 280 }
                }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="h-full rounded-[25px] bg-gradient-to-r from-[#9f6d1c] to-[#39270a] shadow-lg overflow-hidden flex items-center"
              >
                {/* Search Icon Circle (Always visible at the start) */}
                <div className="w-[44px] h-[44px] bg-[#e5e5e5] rounded-full flex items-center justify-center shadow-md shrink-0 cursor-pointer">
                  <svg viewBox="0 0 16 16" className="w-[20px] h-[20px] fill-[#986718]">
                    <path d={IconPaths.Search} />
                  </svg>
                </div>

                {/* Input Text (Revealed on expansion) */}
                <motion.div
                  variants={{
                    initial: { opacity: 0, x: -10 },
                    expanded: { opacity: 1, x: 0 }
                  }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex-1 pr-6 pl-2"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="bg-transparent border-none outline-none font-['Poppins'] text-[15px] text-white placeholder-white/50 w-full"
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Icons */}
            <Link href="/cart">
              <div className="relative w-[44px] h-[44px]">
                <div className="w-[44px] h-[44px] bg-[#e5e5e5] rounded-full flex items-center justify-center shadow-lg hover:bg-white cursor-pointer transition-colors hover:scale-105 active:scale-95 duration-200">
                  <svg viewBox="0 0 23 23" className="w-[20px] h-[20px] fill-[#986718]">
                    <path d={IconPaths.Cart} />
                  </svg>
                </div>
                <AnimatePresence>
                  {mounted && cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold font-['Poppins'] rounded-full flex items-center justify-center px-[4px] shadow-md"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-3 bg-[#e5e5e5] hover:bg-white px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105"
              >
                <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-r from-[#a87522] to-[#774b03] flex items-center justify-center">
                  <span className="text-white text-[14px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-['Poppins'] font-semibold text-[15px] text-[#986718]">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <div
                onClick={() => openAuthModal()}
                className="w-[44px] h-[44px] bg-[#e5e5e5] rounded-full flex items-center justify-center shadow-lg hover:bg-white cursor-pointer transition-colors hover:scale-105 active:scale-95 duration-200"
              >
                <svg viewBox="0 0 23 23" className="w-[20px] h-[20px] fill-[#986718]">
                  <path clipRule="evenodd" fillRule="evenodd" d={IconPaths.User} />
                </svg>
              </div>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="xl:hidden text-white z-50 relative p-2 -mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="xl:hidden fixed inset-0 w-full min-h-screen bg-black/95 backdrop-blur-md pt-24 px-6 flex flex-col gap-8 items-center z-40"
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`font-['Poppins'] font-semibold text-[24px] ${pathname === item.path ? 'text-[#986718]' : 'text-[#e5e5e5]/75'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="w-full h-[1px] bg-white/10" />

              <div className="flex gap-6 mt-4">
                <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                  <div className="relative w-[50px] h-[50px]">
                    <div className="w-[50px] h-[50px] bg-[#e5e5e5] rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                      <svg viewBox="0 0 23 23" className="w-[24px] h-[24px] fill-[#986718]">
                        <path d={IconPaths.Cart} />
                      </svg>
                    </div>
                    <AnimatePresence>
                      {mounted && cartCount > 0 && (
                        <motion.span
                          key={cartCount}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold font-['Poppins'] rounded-full flex items-center justify-center px-[4px] shadow-md"
                        >
                          {cartCount > 99 ? '99+' : cartCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </Link>
                {user ? (
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <div className="w-[50px] h-[50px] bg-[#e5e5e5] rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                      <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-r from-[#a87522] to-[#774b03] flex items-center justify-center">
                        <span className="text-white text-[12px] font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    onClick={() => {
                      openAuthModal();
                      setIsMenuOpen(false);
                    }}
                    className="w-[50px] h-[50px] bg-[#e5e5e5] rounded-full flex items-center justify-center shadow-lg hover:bg-white cursor-pointer transition-colors"
                  >
                    <svg viewBox="0 0 23 23" className="w-[24px] h-[24px] fill-[#986718]">
                      <path clipRule="evenodd" fillRule="evenodd" d={IconPaths.User} />
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => closeAuthModal()}
      />
    </>
  );
};
