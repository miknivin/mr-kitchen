import React from 'react';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { Features } from './components/Features';
import { Comparison } from './components/Comparison';
import { HowToUse } from './components/HowToUse';

export default function Page() {
    return (
        <>
            <Hero />
            <ProductGrid />
            <Features />
            <Comparison />
            <HowToUse />
        </>
    );
}
