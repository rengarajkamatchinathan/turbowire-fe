import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { ChatInterface } from '../components/ChatInterface';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { todoExampleSteps } from '../data/exampleSteps';
import { todoExampleFiles } from '../data/exampleFiles';

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", content: string;}[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  // For demo purposes, use example data if prompt contains "todo"
  const isDemo = prompt.toLowerCase().includes('todo');
  const [steps, setSteps] = useState<Step[]>(isDemo ? todoExampleSteps : []);
  const [files, setFiles] = useState<FileItem[]>(isDemo ? todoExampleFiles : []);

  useEffect(() => {
    if (isDemo) {
      setTemplateSet(true);
      // Auto-select the main App.tsx file for demo
      const appFile = todoExampleFiles.find(f => f.name === 'src')?.children?.find(f => f.name === 'App.tsx');
      if (appFile) {
        setSelectedFile(appFile);
      }
      return;
    }

    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? [];
        let currentFileStructure = [...originalFiles];
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }
    })

    if (updateHappened) {
      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
      }))
    }
  }, [steps, files, isDemo]);

  useEffect(() => {
    if (isDemo) return;

    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer, isDemo]);

  async function init() {
    if (isDemo) return;

    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim()
    });
    setTemplateSet(true);
    
    const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    })

    setLoading(false);

    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);

    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      content
    })));

    setLlmMessages(x => [...x, {role: "assistant", content: stepsResponse.data.response}])
  }

  const handleSendMessage = async () => {
    if (isDemo) {
      setPrompt("");
      return;
    }

    const newMessage = {
      role: "user" as "user",
      content: userPrompt
    };

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...llmMessages, newMessage]
    });
    setLoading(false);

    setLlmMessages(x => [...x, newMessage]);
    setLlmMessages(x => [...x, {
      role: "assistant",
      content: stepsResponse.data.response
    }]);
    
    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);

    setPrompt("");
  };

  useEffect(() => {
    init();
  }, [])

  return (
    <div className="min-h-screen bg-black cyber-grid">
      <Header prompt={prompt} />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-[calc(100vh-5rem)] grid grid-cols-12 gap-6 p-6">
          {/* Left Sidebar - Steps */}
          <div className="col-span-3 space-y-6 overflow-hidden">
            <div className="h-3/5 overflow-auto custom-scrollbar">
              <StepsList
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
            </div>
            <div className="h-2/5">
              <ChatInterface
                userPrompt={userPrompt}
                setPrompt={setPrompt}
                onSend={handleSendMessage}
                loading={loading}
                disabled={!templateSet}
              />
            </div>
          </div>
          
          {/* File Explorer */}
          <div className="col-span-3">
            <FileExplorer 
              files={files} 
              onFileSelect={setSelectedFile}
            />
          </div>
          
          {/* Main Content Area */}
          <div className="col-span-6 glass-effect rounded-xl p-6 border border-zinc-800">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-5rem)]">
              {activeTab === 'code' ? (
                <CodeEditor file={selectedFile} />
              ) : (
                isDemo ? (
                  <div className="h-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/50">
                    <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs">✨</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white">Live Preview</h3>
                          <p className="text-xs text-zinc-500">Todo App Demo</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-[calc(100%-4rem)] p-4 bg-zinc-900/20">
                      <div className="h-full w-full rounded-lg overflow-hidden border border-zinc-700">
                        <iframe
                          src="data:text/html;charset=utf-8,<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <meta name='viewport' content='width=device-width, initial-scale=1.0'>
  <title>Todo App</title>
  <script src='https://unpkg.com/react@18/umd/react.development.js'></script>
  <script src='https://unpkg.com/react-dom@18/umd/react-dom.development.js'></script>
  <script src='https://unpkg.com/@babel/standalone/babel.min.js'></script>
  <script src='https://cdn.tailwindcss.com'></script>
</head>
<body>
  <div id='root'></div>
  <script type='text/babel'>
    const { useState } = React;
    
    function App() {
      const [todos, setTodos] = useState([
        { id: 1, text: 'Learn React', completed: true },
        { id: 2, text: 'Build a todo app', completed: false },
        { id: 3, text: 'Deploy to production', completed: false }
      ]);
      const [inputValue, setInputValue] = useState('');

      const addTodo = () => {
        if (inputValue.trim()) {
          setTodos([...todos, {
            id: Date.now(),
            text: inputValue.trim(),
            completed: false
          }]);
          setInputValue('');
        }
      };

      const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
      };

      const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
      };

      return (
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8'>
          <div className='max-w-md mx-auto'>
            <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20'>
              <h1 className='text-3xl font-bold text-white mb-6 text-center'>
                ✨ Todo App
              </h1>
              
              <div className='flex gap-2 mb-6'>
                <input
                  type='text'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                  placeholder='Add a new todo...'
                  className='flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500'
                />
                <button
                  onClick={addTodo}
                  className='px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200'
                >
                  +
                </button>
              </div>
              
              <div className='space-y-2'>
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      todo.completed
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        todo.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-white/30 hover:border-purple-500'
                      }`}
                    >
                      {todo.completed && '✓'}
                    </button>
                    
                    <span
                      className={`flex-1 transition-all duration-200 ${
                        todo.completed
                          ? 'text-white/70 line-through'
                          : 'text-white'
                      }`}
                    >
                      {todo.text}
                    </span>
                    
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className='w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200'
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
              
              {todos.length === 0 && (
                <div className='text-center py-8 text-white/60'>
                  <div className='text-4xl mb-2'>📝</div>
                  <p>No todos yet. Add one above!</p>
                </div>
              )}
              
              <div className='mt-6 text-center text-white/60 text-sm'>
                {todos.filter(t => !t.completed).length} of {todos.length} tasks remaining
              </div>
            </div>
          </div>
        </div>
      );
    }

    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
</html>"
                          className="w-full h-full border-0"
                          title="Todo App Preview"
                        />
                      </div>
                    </div>
                  </div>
                ) : webcontainer ? (
                  <PreviewFrame webContainer={webcontainer} files={files} />
                ) : (
                  <div className="h-full flex items-center justify-center bg-zinc-950/50 rounded-xl border border-zinc-800">
                    <div className="text-center">
                      <div className="loading-dots mb-4">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <p className="text-zinc-400">Initializing WebContainer...</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}