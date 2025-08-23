
import React from 'react';

interface InputPanelProps {
  technology: string;
  setTechnology: (tech: string) => void;
  complexity: string;
  setComplexity: (level: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const complexityLevels = ['Simple', 'Intermediate', 'Complex'];

const InputPanel: React.FC<InputPanelProps> = ({
  technology,
  setTechnology,
  complexity,
  setComplexity,
  onGenerate,
  isLoading,
}) => {
  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <label htmlFor="technology" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Technology / Framework
                </label>
                <input
                type="text"
                id="technology"
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                placeholder="e.g., React, Node.js, Django"
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                />
            </div>
            <div>
                <label htmlFor="complexity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Project Complexity
                </label>
                <div className="flex space-x-2 bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
                    {complexityLevels.map((level) => (
                        <button
                        key={level}
                        onClick={() => setComplexity(level)}
                        className={`w-full text-center px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-700 focus:ring-primary-500 ${
                            complexity === level
                            ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-900/50'
                        }`}
                        >
                        {level}
                        </button>
                    ))}
                </div>
            </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="px-8 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Structure'
          )}
        </button>
      </div>
    </div>
  );
};

export default InputPanel;
