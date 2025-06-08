import React from 'react';
import { Zap, Settings, User, Bell } from 'lucide-react';

interface HeaderProps {
  prompt: string;
}

export function Header({ prompt }: HeaderProps) {
  return (
    <header className="bg-black/50 backdrop-blur-xl border-b border-white/10 px-6 py-4 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">Turbowire AI</h1>
              <div className="text-xs text-zinc-400">Website Builder</div>
            </div>
          </div>
          <div className="h-6 w-px bg-white/20"></div>
          <div className="max-w-md">
            <div className="text-sm text-zinc-300 font-medium mb-1">Current Project</div>
            <div className="text-xs text-zinc-400 truncate">{prompt}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-zinc-400" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-zinc-400" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <User className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </div>
    </header>
  );
}