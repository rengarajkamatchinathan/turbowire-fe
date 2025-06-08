import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useRef, useState } from 'react';
import sdk from '@stackblitz/sdk';
import { FileItem } from '../types';
import { ExternalLink, RefreshCw, Smartphone, Monitor, Tablet } from 'lucide-react';

interface PreviewFrameProps {
  files: FileItem[];
  webContainer: WebContainer;
}

export function PreviewFrame({ files }: PreviewFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    if (!containerRef.current || !files.length) return;

    setIsLoading(true);
    
    const projectFiles: Record<string, string> = {};
    
    const processFiles = (items: FileItem[], basePath: string = '') => {
      items.forEach(item => {
        const path = basePath ? `${basePath}/${item.name}` : item.name;
        
        if (item.type === 'file' && item.content) {
          projectFiles[path] = item.content;
        } else if (item.type === 'folder' && item.children) {
          processFiles(item.children, path);
        }
      });
    };

    processFiles(files);

    sdk.embedProject(containerRef.current, {
      title: 'Live Preview',
      description: 'Live preview of your code',
      template: 'node',
      files: projectFiles,
      settings: {
        theme: 'dark'
      }
    }, {
      clickToLoad: false,
      hideExplorer: true,
      hideNavigation: true,
      terminalHeight: 0,
      showSidebar: false
    }).then(() => {
      setIsLoading(false);
    });
  }, [files]);

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="h-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/50">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <ExternalLink className="w-3 h-3 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Live Preview</h3>
            <p className="text-xs text-zinc-500">Real-time application preview</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'desktop' ? 'bg-blue-500 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'tablet' ? 'bg-blue-500 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'mobile' ? 'bg-blue-500 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group">
            <RefreshCw className="w-4 h-4 text-zinc-400 group-hover:text-white" />
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group">
            <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-white" />
          </button>
        </div>
      </div>
      
      <div className="h-[calc(100%-4rem)] p-4 bg-zinc-900/20">
        {isLoading && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="loading-dots mb-4">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p className="text-zinc-400 text-sm">Loading preview...</p>
            </div>
          </div>
        )}
        
        <div className={`h-full transition-all duration-300 ${getViewportClass()}`}>
          <div 
            ref={containerRef} 
            className="h-full w-full rounded-lg overflow-hidden border border-zinc-700 bg-white"
          />
        </div>
      </div>
    </div>
  );
}