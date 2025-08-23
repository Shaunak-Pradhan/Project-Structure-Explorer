
import React, { useState } from 'react';
import { FileSystemNode } from '../types';
import { CopyIcon } from './icons';

interface FileDetailsProps {
  file: FileSystemNode | null;
}

const FileDetails: React.FC<FileDetailsProps> = ({ file }) => {
  const [copied, setCopied] = useState(false);
  
  if (!file) {
    return (
      <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 border border-slate-200 dark:border-slate-700 h-full flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Select a file or folder from the tree to see its details.</p>
      </div>
    );
  }

  const handleCopy = () => {
    if (file.snippet) {
      navigator.clipboard.writeText(file.snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{file.name}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Type: {file.type}</p>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Purpose</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{file.purpose}</p>
        </div>

        {file.alternatives && file.alternatives.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Alternative Names</h3>
            <div className="flex flex-wrap gap-2">
              {file.alternatives.map((alt, index) => (
                <span key={index} className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-xs font-mono rounded-md">
                  {alt}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {file.snippet && file.type === 'file' && (
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Example Snippet</h3>
            <div className="relative group">
              <pre className="bg-slate-100 dark:bg-slate-900/70 p-4 rounded-lg text-xs text-slate-700 dark:text-slate-300 overflow-x-auto">
                <code>{file.snippet}</code>
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 bg-slate-200 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <CopyIcon className="w-4 h-4" />
                {copied && <span className="absolute -top-7 right-0 bg-slate-800 text-white text-xs px-2 py-1 rounded">Copied!</span>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDetails;
