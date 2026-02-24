import React from 'react';
import '../styles/index.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export const metadata = {
    title: 'MrKitchen',
    description: 'Premium cleaning products for your home',
    icons: {
        icon: '/favicon.png',
    },
};

import { ReduxProvider } from '../components/ReduxProvider';
import { AuthModalProvider } from '@/context/AuthModalContext';
import { Toaster } from 'sonner';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-black text-[#e5e5e5] overflow-x-hidden font-['Poppins']">
                <ReduxProvider>
                    <AuthModalProvider>
                        <Toaster richColors position="top-right" theme="dark" duration={2000} />
                        <Header />
                        <main>{children}</main>
                        <Footer />
                    </AuthModalProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
