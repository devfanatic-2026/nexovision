/**
 * Global Store Example
 * Demonstrates createFloatStore with localStorage persistence
 */

'use client';

import { createFloatStore } from '@float.js/core';
import { useEffect } from 'react';

// Create a persistent store
const useTodoStore = createFloatStore(
    {
        todos: [] as Array<{ id: number; text: string; completed: boolean }>,
        filter: 'all' as 'all' | 'active' | 'completed',
    },
    {
        persist: 'float-todos', // Persists to localStorage
    }
);

export default function StorePage() {
    const todos = useTodoStore(state => state.todos);
    const filter = useTodoStore(state => state.filter);

    const addTodo = (text: string) => {
        if (!text.trim()) return;
        const newTodo = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
        };
        useTodoStore.setState({ todos: [...todos, newTodo] });
    };

    const toggleTodo = (id: number) => {
        useTodoStore.setState({
            todos: todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t),
        });
    };

    const deleteTodo = (id: number) => {
        useTodoStore.setState({
            todos: todos.filter(t => t.id !== id),
        });
    };

    const clearCompleted = () => {
        useTodoStore.setState({
            todos: todos.filter(t => !t.completed),
        });
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const stats = {
        total: todos.length,
        active: todos.filter(t => !t.completed).length,
        completed: todos.filter(t => t.completed).length,
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Global Store</h1>
                <p className="text-gray-600 mt-2">createFloatStore with localStorage persistence</p>
            </div>

            {/* Persistence Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex gap-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm text-blue-800 font-medium">Data persists across page reloads!</p>
                        <p className="text-xs text-blue-600 mt-1">Try refreshing the page - your todos will still be here</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
                {/* Add Todo */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const input = e.currentTarget.elements.namedItem('todo') as HTMLInputElement;
                        addTodo(input.value);
                        input.value = '';
                    }}
                    className="flex gap-2 mb-6"
                >
                    <input
                        name="todo"
                        type="text"
                        placeholder="What needs to be done?"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Add
                    </button>
                </form>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {(['all', 'active', 'completed'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => useTodoStore.setState({ filter: f })}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${filter === f
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Todo List */}
                <div className="space-y-2 mb-6">
                    {filteredTodos.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <div className="text-4xl mb-2">📝</div>
                            <p>No todos {filter !== 'all' && `in "${filter}"`}</p>
                        </div>
                    ) : (
                        filteredTodos.map(todo => (
                            <div
                                key={todo.id}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo.id)}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                    {todo.text}
                                </span>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Actions */}
                {stats.completed > 0 && (
                    <button
                        onClick={clearCompleted}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                        Clear {stats.completed} completed {stats.completed === 1 ? 'todo' : 'todos'}
                    </button>
                )}

                {/* Stats */}
                <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
                        <div className="text-xs text-gray-500">Active</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                        <div className="text-xs text-gray-500">Completed</div>
                    </div>
                </div>
            </div>

            {/* Code Example */}
            <div className="bg-gray-900 rounded-xl p-6 mt-8 overflow-x-auto">
                <pre className="text-green-400 text-sm">
                    {`import { createFloatStore } from '@float.js/core';

// Create store with persistence
const useTodoStore = createFloatStore(
  { todos: [], filter: 'all' },
  { persist: 'float-todos' } // ← Persists to localStorage!
);

// Use in components
const todos = useTodoStore(state => state.todos);

// Update state
useTodoStore.setState({ todos: [...todos, newTodo] });`}
                </pre>
            </div>
        </div>
    );
}
