import React, { useState } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export function TodoExample() {
  const [todos, setTodos] = useState<Todo[]>([
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

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
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
              onKeyPress={handleKeyPress}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={addTodo}
              className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2">
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
                  {todo.completed && <Check className="w-4 h-4" />}
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
          
          <div className="mt-6 text-center text-white/60 text-sm">
            {todos.filter(t => !t.completed).length} of {todos.length} tasks remaining
          </div>
        </div>
      </div>
    </div>
  );
}