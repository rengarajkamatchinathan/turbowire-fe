import React from 'react';
import Editor from '@monaco-editor/react';
import { FileItem } from '../types';

interface CodeEditorProps {
  file: FileItem | null;
}

export function CodeEditor({ file }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 bg-[#1a1b26] rounded-lg">
        <p className="text-lg">Select a file to view its contents</p>
      </div>
    );
  }

  return (
    <div className="h-full rounded-lg overflow-hidden border border-gray-700">
      <Editor
        height="100%"
        defaultLanguage="typescript"
        theme="vs-dark"
        value={file.content || ''}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          renderLineHighlight: 'all',
          contextmenu: false,
          fontFamily: 'JetBrains Mono, monospace',
          fontLigatures: true,
        }}
      />
    </div>
  );
}