import React from 'react';

const Loader = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer glowing ring */}
        <div className={`rounded-full border-t-emerald-500 border-r-transparent border-b-indigo-500 border-l-transparent animate-spin ${sizeClasses[size]}`}></div>
        {/* Inner pulsing core */}
        <div className="absolute inset-2 bg-gradient-to-tr from-emerald-500 to-indigo-600 rounded-full opacity-40 animate-ping"></div>
      </div>
      {message && (
        <span className="text-sm font-medium text-slate-400 tracking-wider animate-pulse">
          {message}
        </span>
      )}
    </div>
  );
};

export default Loader;
