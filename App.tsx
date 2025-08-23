
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ProjectStructureResponse, FileSystemNode } from './types';
import { generateProjectStructure } from './services/geminiService';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import FileTree from './components/FileTree';
import FileDetails from './components/FileDetails';
import ProjectInstructions from './components/ProjectInstructions';
import LoadingSpinner from './components/LoadingSpinner';
import { DownloadIcon, MarkdownIcon } from './components/icons';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [technology, setTechnology] = useState<string>('React');
  const [complexity, setComplexity] = useState<string>('Intermediate');
  const [projectData, setProjectData] = useState<ProjectStructureResponse | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileSystemNode | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleGenerate = useCallback(async () => {
    if (!technology) {
      setError('Please enter a technology or framework.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setProjectData(null);
    setSelectedFile(null);

    try {
      const data = await generateProjectStructure(technology, complexity);
      setProjectData(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate project structure. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [technology, complexity]);
  
  const handleFileSelect = (file: FileSystemNode) => {
    setSelectedFile(file);
  };
  
  const filteredFileTree = useMemo(() => {
      if (!projectData?.fileTree || !searchTerm) {
          return projectData?.fileTree ?? null;
      }
  
      const filter = (node: FileSystemNode): FileSystemNode | null => {
          if (node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
              return node;
          }
  
          if (node.type === 'folder' && node.children) {
              const newChildren = node.children.map(filter).filter((child): child is FileSystemNode => child !== null);
              if (newChildren.length > 0) {
                  return { ...node, children: newChildren };
              }
          }
  
          return null;
      };
  
      return filter(projectData.fileTree);
  }, [projectData, searchTerm]);


  const exportAsJson = () => {
    if (!projectData) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(projectData, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `${technology.toLowerCase()}-${complexity.toLowerCase()}-structure.json`;
    link.click();
  };

  const generateMarkdown = (node: FileSystemNode, prefix = ''): string => {
    let markdown = `${prefix}${node.type === 'folder' ? '📁' : '📄'} ${node.name}\n`;
    if (node.children) {
      node.children.forEach((child, index) => {
        const newPrefix = prefix + (index === node.children!.length - 1 ? '    ' : '│   ');
        markdown += generateMarkdown(child, newPrefix.replace(/`$/, ' '));
      });
    }
    return markdown;
  };

  const exportAsMarkdown = () => {
    if (!projectData) return;
    const markdownContent = generateMarkdown(projectData.fileTree);
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${technology.toLowerCase()}-${complexity.toLowerCase()}-structure.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen font-sans transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <InputPanel
            technology={technology}
            setTechnology={setTechnology}
            complexity={complexity}
            setComplexity={setComplexity}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>

        {error && <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-600">{error}</div>}
        
        {isLoading && <div className="mt-8 flex justify-center"><LoadingSpinner /></div>}

        {projectData && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white dark:bg-slate-800/50 shadow-md rounded-xl p-4 border border-slate-200 dark:border-slate-700 h-fit">
              <div className="flex justify-between items-center mb-4">
                  <input
                      type="text"
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
              </div>
              {filteredFileTree ? (
                <FileTree root={filteredFileTree} onFileSelect={handleFileSelect} selectedFile={selectedFile} />
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 py-4">No matching files found.</div>
              )}
            </div>
            <div className="lg:col-span-2 space-y-8">
                <FileDetails file={selectedFile} />
                <ProjectInstructions instructions={projectData} />
                 <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Export Structure</h2>
                    <div className="flex space-x-4">
                        <button onClick={exportAsJson} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none">
                            <DownloadIcon />
                            <span>Export as JSON</span>
                        </button>
                        <button onClick={exportAsMarkdown} className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-slate-500 focus:outline-none">
                            <MarkdownIcon />
                            <span>Export as Markdown</span>
                        </button>
                    </div>
                </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
