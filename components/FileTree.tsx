
import React, { useState } from 'react';
import { FileSystemNode } from '../types';
import { FolderIcon, FileIcon, ChevronDownIcon } from './icons';

interface TreeNodeProps {
  node: FileSystemNode;
  onFileSelect: (file: FileSystemNode) => void;
  selectedFile: FileSystemNode | null;
  isInitiallyOpen?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, onFileSelect, selectedFile, isInitiallyOpen = false }) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);
  const isFolder = node.type === 'folder';

  const handleToggle = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = () => {
    onFileSelect(node);
  };
  
  const isSelected = selectedFile?.name === node.name && selectedFile?.purpose === node.purpose;

  return (
    <div className="ml-4">
      <div
        onClick={isFolder ? handleToggle : handleSelect}
        className={`flex items-center space-x-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors duration-150 ${
          isSelected ? 'bg-primary-100 dark:bg-primary-900/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
        }`}
      >
        {isFolder ? (
          <>
            <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
            <FolderIcon className="w-5 h-5 text-yellow-500" />
          </>
        ) : (
          <>
            <span className="w-4 h-4"></span> {/* Spacer */}
            <FileIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </>
        )}
        <span className={`text-sm ${isSelected ? 'font-semibold text-primary-700 dark:text-primary-300' : 'text-slate-700 dark:text-slate-300'}`}>
          {node.name}
        </span>
      </div>
      {isFolder && isOpen && (
        <div className="border-l border-slate-200 dark:border-slate-700">
          {node.children?.map((child, index) => (
            <TreeNode key={`${child.name}-${index}`} node={child} onFileSelect={onFileSelect} selectedFile={selectedFile} isInitiallyOpen={isInitiallyOpen} />
          ))}
        </div>
      )}
    </div>
  );
};


interface FileTreeProps {
  root: FileSystemNode;
  onFileSelect: (file: FileSystemNode) => void;
  selectedFile: FileSystemNode | null;
}

const FileTree: React.FC<FileTreeProps> = ({ root, onFileSelect, selectedFile }) => {
  return (
    <div>
        <TreeNode node={root} onFileSelect={onFileSelect} selectedFile={selectedFile} isInitiallyOpen={true} />
    </div>
  );
};

export default FileTree;
