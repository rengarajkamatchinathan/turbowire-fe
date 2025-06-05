import React from 'react';
import { Code2, Eye } from 'lucide-react';

interface TabViewProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

export function TabView({ activeTab, onTabChange }: TabViewProps) {
  return (
    <div className="flex space-x-2 mb-4">
      <button
        onClick={() => onTabChange('code')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
          activeTab === 'code'
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
            : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1b26]'
        }`}
      >
        <Code2 className="w-4 h-4" />
        Code
      </button>
      <button
        onClick={() => onTabChange('preview')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
          activeTab === 'preview'
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
            : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1b26]'
        }`}
      >
        <Eye className="w-4 h-4" />
        Preview
      </button>
    </div>
  );
}