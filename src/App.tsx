import React from 'react';
import { SwapWidget } from './components/SwapWidget';
export function App() {
  return <div className="min-h-screen w-full bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0F172A] to-black opacity-80" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

      {/* Content */}
      <div className="relative z-10 w-full">
        <SwapWidget />
      </div>
    </div>;
}