import React from 'react';
import { CheckCircle2, Circle, Clock, Play, Code, Terminal, FileText, Folder } from 'lucide-react';
import { Step, StepType } from '../types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

const getStepIcon = (type: StepType) => {
  switch (type) {
    case StepType.CreateFile:
      return FileText;
    case StepType.CreateFolder:
      return Folder;
    case StepType.RunScript:
      return Terminal;
    default:
      return Code;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle2;
    case 'in-progress':
      return Clock;
    default:
      return Circle;
  }
};

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  return (
    <div className="glass-effect rounded-xl p-6 h-full overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Play className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-white">Build Steps</h2>
        <div className="ml-auto text-xs text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded-full">
          {steps.filter(s => s.status === 'completed').length}/{steps.length}
        </div>
      </div>
      
      <div className="space-y-3 overflow-auto custom-scrollbar max-h-[calc(100%-5rem)]">
        {steps.map((step, index) => {
          const StatusIcon = getStatusIcon(step.status);
          const StepIcon = getStepIcon(step.type);
          const isActive = currentStep === step.id;
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in-progress';
          
          return (
            <div
              key={step.id}
              className={`step-connector relative group cursor-pointer transition-all duration-300 ${
                isActive ? 'scale-[1.02]' : ''
              }`}
              onClick={() => onStepClick(step.id)}
            >
              <div className={`
                relative p-4 rounded-xl border transition-all duration-300
                ${isActive 
                  ? 'bg-blue-500/10 border-blue-500/30 glow-effect' 
                  : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70'
                }
              `}>
                <div className="flex items-start gap-3">
                  <div className={`
                    relative flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                    ${isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isInProgress 
                        ? 'bg-blue-500 text-white pulse-glow' 
                        : 'bg-zinc-700 text-zinc-400'
                    }
                  `}>
                    <StatusIcon className="w-3 h-3" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <StepIcon className="w-4 h-4 text-zinc-400" />
                      <h3 className={`font-medium text-sm truncate ${
                        isActive ? 'text-blue-300' : 'text-white'
                      }`}>
                        {step.title}
                      </h3>
                    </div>
                    
                    {step.description && (
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {step.description}
                      </p>
                    )}
                    
                    {step.path && (
                      <div className="mt-2 text-xs text-zinc-500 font-mono bg-zinc-800/50 px-2 py-1 rounded">
                        {step.path}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className={`
                      w-2 h-2 rounded-full transition-all duration-300
                      ${isCompleted 
                        ? 'bg-green-400' 
                        : isInProgress 
                          ? 'bg-blue-400 animate-pulse' 
                          : 'bg-zinc-600'
                      }
                    `}></div>
                  </div>
                </div>
                
                {isInProgress && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}