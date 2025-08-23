
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">Generating Project...</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">Please wait a moment.</p>
    </div>
  );
};

export default LoadingSpinner;
