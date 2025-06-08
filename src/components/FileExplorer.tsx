import React, { useState } from 'react';
import { 
  FolderTree, 
  File, 
  ChevronRight, 
  ChevronDown, 
  Search,
  Filter,
  MoreHorizontal,
  FileCode,
  FileImage,
  FileText as FileTextIcon,
  Folder,
  FolderOpen
} from 'lucide-react';
import { FileItem } from '../types';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
  selectedFile?: FileItem | null;
}

const getFileIcon = (fileName: string, isFolder: boolean, isOpen?: boolean) => {
  if (isFolder) {
    return isOpen ? FolderOpen : Folder;
  }
  
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'vue':
    case 'py':
    case 'java':
    case 'cpp':
    case 'c':
      return FileCode;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
      return FileImage;
    default:
      return FileTextIcon;
  }
};

function FileNode({ item, depth, onFileClick, selectedFile }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth === 0);
  const isSelected = selectedFile?.path === item.path;
  
  const handleClick = () => {
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  const Icon = getFileIcon(item.name, item.type === 'folder', isExpanded);

  return (
    <div className="select-none">
      <div
        className={`
          group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200
          ${isSelected 
            ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300' 
            : 'hover:bg-zinc-800/50 text-zinc-300 hover:text-white'
          }
        `}
        style={{ paddingLeft: `${depth * 1.2 + 0.5}rem` }}
        onClick={handleClick}
      >
        {item.type === 'folder' && (
          <span className={`transition-transform duration-200 ${
            isExpanded ? 'rotate-90' : ''
          }`}>
            <ChevronRight className="w-3 h-3 text-zinc-500" />
          </span>
        )}
        
        <Icon className={`w-4 h-4 flex-shrink-0 ${
          item.type === 'folder' 
            ? 'text-blue-400' 
            : isSelected 
              ? 'text-blue-300' 
              : 'text-zinc-400'
        }`} />
        
        <span className="text-sm font-medium truncate flex-1">
          {item.name}
        </span>
        
        {item.type === 'file' && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-3 h-3 text-zinc-500" />
          </div>
        )}
      </div>
      
      {item.type === 'folder' && isExpanded && item.children && (
        <div className="mt-1">
          {item.children.map((child, index) => (
            <FileNode
              key={`${child.path}-${index}`}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  return (
    <div className="glass-effect rounded-xl p-4 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <FolderTree className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-white">Explorer</h2>
        </div>
        <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors">
          <Filter className="w-4 h-4 text-zinc-400" />
        </button>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
        />
      </div>
      
      <div className="space-y-1 overflow-auto custom-scrollbar max-h-[calc(100%-8rem)]">
        {files.length === 0 ? (
          <div className="text-center py-8">
            <FolderTree className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No files yet</p>
            <p className="text-zinc-600 text-xs mt-1">Files will appear here as they're created</p>
          </div>
        ) : (
          files.map((file, index) => (
            <FileNode
              key={`${file.path}-${index}`}
              item={file}
              depth={0}
              onFileClick={handleFileSelect}
              selectedFile={selectedFile}
            />
          ))
        )}
      </div>
    </div>
  );
}