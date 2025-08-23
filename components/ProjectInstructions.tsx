
import React, { useState } from 'react';
import { ProjectStructureResponse, RunCommand, Dependency } from '../types';
import { CopyIcon } from './icons';

interface ProjectInstructionsProps {
  instructions: ProjectStructureResponse;
}

const Command: React.FC<{ command: RunCommand }> = ({ command }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-4">
      <p className="text-slate-600 dark:text-slate-300 mb-1">{command.description}</p>
      <div className="relative group flex items-center">
        <pre className="w-full bg-slate-100 dark:bg-slate-900/70 p-3 rounded-md text-sm text-slate-700 dark:text-slate-200 font-mono overflow-x-auto">
          <code>{command.command}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute right-2 p-1.5 bg-slate-200 dark:bg-slate-700 rounded-md text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <CopyIcon className="w-4 h-4" />
          {copied && <span className="absolute -top-7 right-0 bg-slate-800 text-white text-xs px-2 py-1 rounded">Copied!</span>}
        </button>
      </div>
    </div>
  );
};

const ProjectInstructions: React.FC<ProjectInstructionsProps> = ({ instructions }) => {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <div>
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">How to Run</h2>
        {instructions.runCommands.length > 0 ? (
          instructions.runCommands.map((cmd, index) => <Command key={index} command={cmd} />)
        ) : (
          <p className="text-slate-500 dark:text-slate-400">No run commands provided.</p>
        )}
      </div>

      {instructions.dependencies.length > 0 && (
        <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Dependencies & Setup</h2>
          <ul className="space-y-4">
            {instructions.dependencies.map((dep, index) => (
              <li key={index}>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">{dep.name}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{dep.setup}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectInstructions;
