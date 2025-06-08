import React, { useState } from 'react';
import { Send, Sparkles, Mic, Paperclip, RotateCcw } from 'lucide-react';

interface ChatInterfaceProps {
  userPrompt: string;
  setPrompt: (prompt: string) => void;
  onSend: () => void;
  loading: boolean;
  disabled: boolean;
}

export function ChatInterface({ userPrompt, setPrompt, onSend, loading, disabled }: ChatInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userPrompt.trim() && !loading && !disabled) {
      onSend();
    }
  };

  return (
    <div className="glass-effect rounded-xl p-4 border border-zinc-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
        {loading && (
          <div className="ml-auto">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={userPrompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you'd like to build or modify..."
            disabled={disabled}
            className="w-full p-4 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-none min-h-[100px] custom-scrollbar"
            rows={4}
          />
          
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRecording(!isRecording)}
              className={`p-2 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-500 text-white' 
                  : 'hover:bg-zinc-800 text-zinc-400'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset conversation
          </button>
          
          <button
            type="submit"
            disabled={!userPrompt.trim() || loading || disabled}
            className="button-glow flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Generating...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}