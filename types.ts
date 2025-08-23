
export interface FileSystemNode {
  name: string;
  type: 'file' | 'folder';
  purpose: string;
  snippet?: string;
  alternatives?: string[];
  children?: FileSystemNode[];
}

export interface RunCommand {
  description: string;
  command: string;
}

export interface Dependency {
  name: string;
  setup: string;
}

export interface ProjectStructureResponse {
  technology: string;
  complexity: string;
  fileTree: FileSystemNode;
  runCommands: RunCommand[];
  dependencies: Dependency[];
}
