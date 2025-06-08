import { Step, StepType } from '../types';

export const todoExampleSteps: Step[] = [
  {
    id: 1,
    title: "Initialize Todo Project",
    description: "Setting up the project structure and dependencies",
    type: StepType.CreateFolder,
    status: 'completed'
  },
  {
    id: 2,
    title: "Create package.json",
    description: "Configure project dependencies and scripts",
    type: StepType.CreateFile,
    status: 'completed',
    path: "package.json",
    code: `{
  "name": "simple-todo-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.0"
  }
}`
  },
  {
    id: 3,
    title: "Create index.html",
    description: "Main HTML entry point for the application",
    type: StepType.CreateFile,
    status: 'completed',
    path: "index.html",
    code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Simple Todo App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
  },
  {
    id: 4,
    title: "Create main.tsx",
    description: "React application entry point",
    type: StepType.CreateFile,
    status: 'completed',
    path: "src/main.tsx",
    code: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
  },
  {
    id: 5,
    title: "Create App.tsx",
    description: "Main application component with todo functionality",
    type: StepType.CreateFile,
    status: 'completed',
    path: "src/App.tsx",
    code: `import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
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

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            ✨ Todo App
          </h1>
          
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={addTodo}
              className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={\`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 \${
                  todo.completed
                    ? 'bg-green-500/20 border border-green-500/30'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }\`}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={\`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 \${
                    todo.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-white/30 hover:border-purple-500'
                  }\`}
                >
                  {todo.completed && <Check className="w-4 h-4" />}
                </button>
                
                <span
                  className={\`flex-1 transition-all duration-200 \${
                    todo.completed
                      ? 'text-white/70 line-through'
                      : 'text-white'
                  }\`}
                >
                  {todo.text}
                </span>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          {todos.length === 0 && (
            <div className="text-center py-8 text-white/60">
              <div className="text-4xl mb-2">📝</div>
              <p>No todos yet. Add one above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;`
  },
  {
    id: 6,
    title: "Create index.css",
    description: "Global styles and Tailwind CSS configuration",
    type: StepType.CreateFile,
    status: 'completed',
    path: "src/index.css",
    code: `@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`
  },
  {
    id: 7,
    title: "Create vite.config.ts",
    description: "Vite configuration for React development",
    type: StepType.CreateFile,
    status: 'completed',
    path: "vite.config.ts",
    code: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`
  },
  {
    id: 8,
    title: "Install Dependencies",
    description: "Installing required packages for the todo app",
    type: StepType.RunScript,
    status: 'completed',
    code: "npm install"
  },
  {
    id: 9,
    title: "Start Development Server",
    description: "Running the todo app in development mode",
    type: StepType.RunScript,
    status: 'in-progress',
    code: "npm run dev"
  }
];