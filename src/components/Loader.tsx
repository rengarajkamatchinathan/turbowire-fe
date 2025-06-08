import React from 'react';

export function Loader() {
  return (
    <div className="flex justify-center items-center w-full py-8">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animation-delay-150"></div>
      </div>
    </div>
  );
}