import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useRef } from 'react';
import sdk from '@stackblitz/sdk';
import { FileItem } from '../types';

interface PreviewFrameProps {
  files: FileItem[];
  webContainer: WebContainer;
}

export function PreviewFrame({ files }: PreviewFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !files.length) return;

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
    });
  }, [files]);

  return (
    <div ref={containerRef} className="h-full w-full rounded-lg overflow-hidden border border-gray-700" />
  );
}