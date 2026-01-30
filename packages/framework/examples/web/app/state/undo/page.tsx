/**
 * Undo/Redo Store Example
 * Demonstrates floatMiddleware.undoable for time-travel state
 */

'use client';

import { createFloatStore, floatMiddleware } from '@float.js/core';

// Create store with undo/redo middleware
const useEditorStore = createFloatStore(
    {
        content: 'Start typing here...',
        fontSize: 16,
        color: '#000000'
    },
    {
        middleware: floatMiddleware.undoable(20) // Keep 20 history states
    }
);

export default function UndoRedoPage() {
    const content = useEditorStore(state => state.content);
    const fontSize = useEditorStore(state => state.fontSize);
    const color = useEditorStore(state => state.color);

    // Access store methods
    const { undo, redo, canUndo, canRedo } = useEditorStore;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <a href="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
                    Back to Examples
                </a>
                <h1 className="text-3xl font-bold text-gray-900">Undo/Redo State</h1>
                <p className="text-gray-600 mt-2">Time-travel state management with built-in middleware</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Font Size */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">Size</span>
                            <input
                                type="number"
                                value={fontSize}
                                onChange={(e) => useEditorStore.setState({ fontSize: Number(e.target.value) })}
                                className="w-16 px-2 py-1 border rounded"
                            />
                        </div>
                        {/* Color */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-600">Color</span>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => useEditorStore.setState({ color: e.target.value })}
                                className="w-8 h-8 rounded cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => undo && undo()}
                            disabled={!canUndo || !canUndo()}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${canUndo && canUndo() ? 'bg-white border hover:bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            Undo
                        </button>
                        <button
                            onClick={() => redo && redo()}
                            disabled={!canRedo || !canRedo()}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${canRedo && canRedo() ? 'bg-white border hover:bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Redo
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Editor Area */}
                <textarea
                    value={content}
                    onChange={(e) => useEditorStore.setState({ content: e.target.value })}
                    className="w-full h-64 p-6 outline-none resize-none transition-all duration-200"
                    style={{
                        fontSize: `${fontSize}px`,
                        color: color,
                        fontFamily: 'monospace'
                    }}
                />

                <div className="bg-gray-50 border-t border-gray-200 px-6 py-2 text-xs text-gray-500 flex justify-between">
                    <span>{content.length} characters</span>
                    <span>Press Cmd+Z to undo</span>
                </div>
            </div>
        </div>
    );
}
