import React from 'react';
import Editor from '@monaco-editor/react';
import { FileItem } from '../types';
import { Code2, Copy, Download, ExternalLink } from 'lucide-react';

interface CodeEditorProps {
  file: FileItem | null;
}

export function CodeEditor({ file }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-950/50 rounded-xl border border-zinc-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Code2 className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-medium text-zinc-300 mb-2">No file selected</h3>
          <p className="text-sm text-zinc-500">Choose a file from the explorer to view its contents</p>
        </div>
      </div>
    );
  }

  const getLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': return 'javascript';
      case 'ts': return 'typescript';
      case 'jsx': return 'javascript';
      case 'tsx': return 'typescript';
      case 'css': return 'css';
      case 'html': return 'html';
      case 'json': return 'json';
      case 'md': return 'markdown';
      case 'py': return 'python';
      case 'java': return 'java';
      case 'cpp': case 'c': return 'cpp';
      default: return 'plaintext';
    }
  };

  return (
    <div className="h-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/50">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Code2 className="w-3 h-3 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{file.name}</h3>
            <p className="text-xs text-zinc-500">{file.path}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group">
            <Copy className="w-4 h-4 text-zinc-400 group-hover:text-white" />
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group">
            <Download className="w-4 h-4 text-zinc-400 group-hover:text-white" />
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group">
            <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-white" />
          </button>
        </div>
      </div>
      
      <div className="h-[calc(100%-4rem)]">
        <Editor
          height="100%"
          language={getLanguage(file.name)}
          theme="vs-dark"
          value={file.content || ''}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            lineHeight: 1.6,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 20, bottom: 20 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            renderLineHighlight: 'all',
            contextmenu: false,
            fontLigatures: true,
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            renderWhitespace: 'selection',
            showFoldingControls: 'always',
          }}
        />
      </div>
    </div>
  );
}