import React from 'react';
import { SwapWidget } from './components/SwapWidget';
import { Providers } from './Providers';

export function App() {
  return (
    <Providers>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />

        {/* Content */}
        <div className="relative z-10 w-full">
          <SwapWidget />
        </div>
      </div>
    </Providers>
  );
}