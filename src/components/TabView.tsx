import React from 'react';
import { Code2, Eye, Terminal, Settings } from 'lucide-react';

interface TabViewProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

export function TabView({ activeTab, onTabChange }: TabViewProps) {
  const tabs = [
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'preview', label: 'Preview', icon: Eye },
  ] as const;

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center bg-zinc-900/50 rounded-xl p-1 border border-zinc-800">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium
              ${activeTab === id
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {label}
            {activeTab === id && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 -z-10"></div>
            )}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group">
          <Terminal className="w-4 h-4 text-zinc-400 group-hover:text-white" />
        </button>
        <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group">
          <Settings className="w-4 h-4 text-zinc-400 group-hover:text-white" />
        </button>
      </div>
    </div>
  );
}