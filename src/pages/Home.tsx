import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Sparkles, Code, Rocket, ArrowRight } from 'lucide-react';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    }
  };

  const examples = [
    "Create a modern portfolio website with dark theme",
    "Build a todo app with React and local storage",
    "Design a landing page for a SaaS product",
    "Make a blog with markdown support"
  ];

  return (
    <div className="min-h-screen bg-black cyber-grid relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12 fade-in">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center floating-animation">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold mb-6">
              <span className="text-gradient">Bolt AI</span>
            </h1>
            <p className="text-xl text-zinc-300 mb-4 max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into reality with AI-powered web development
            </p>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Describe your vision, and watch as we build your website step by step with modern technologies
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 slide-in">
            <div className="holographic-border p-8">
              <div className="space-y-6">
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the website you want to build..."
                    className="w-full h-40 p-6 bg-zinc-900/50 text-white border border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-zinc-500 text-lg custom-scrollbar"
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 text-zinc-500 text-sm">
                    <Code className="w-4 h-4" />
                    AI-Powered
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {examples.map((example, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setPrompt(example)}
                      className="px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:text-white transition-all duration-200 hover:border-zinc-600"
                    >
                      {example}
                    </button>
                  ))}
                </div>
                
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="button-glow w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center gap-3"
                >
                  <Rocket className="w-5 h-5" />
                  Generate Website
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
          
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-8 text-zinc-500 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Real-time Preview
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Modern Stack
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                AI-Powered
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}