'use client';

/*
 * HMR (Hot Module Replacement) Demo Component
 *
 * HMR is a development feature that enables instantaneous updates to your application
 * without a full page reload. This preserves the application state while updating
 * the code changes in real-time.
 *
 * Benefits of HMR in Float.js:
 * 1. Faster development cycle - see changes instantly without losing app state
 * 2. Improved productivity - no need to navigate back to the same UI state after each change
 * 3. Better debugging experience - maintain component state during development
 * 4. Time savings - eliminates the need for full page refreshes
 *
 * In Float.js, HMR works by:
 * - Watching file changes in real-time using chokidar
 * - Establishing a WebSocket connection for instant communication
 * - Sending update notifications to the browser when files change
 * - Updating only the changed modules without reloading the entire page
 */

import { useState, useEffect } from 'react';

export default function HRMDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('Edit me to see HMR in action!');

  // This counter will maintain its state even when you make changes to this file
  // and save it, demonstrating how HMR preserves component state
  const increment = () => setCount(count + 1);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">HMR (Hot Module Replacement) Demo</h2>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded border border-blue-200">
          <h3 className="font-semibold text-blue-800">Counter State Preservation</h3>
          <p className="text-gray-600">Current count: <span className="font-bold text-blue-600">{count}</span></p>
          <button
            onClick={increment}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Increment Counter
          </button>
          <p className="mt-2 text-sm text-gray-500">
            Try changing this text or button color, then save the file - the counter state will be preserved!
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded border border-green-200">
          <h3 className="font-semibold text-green-800">Editable Text</h3>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
          <p className="mt-2 text-gray-600">Current text: <span className="font-medium">{text}</span></p>
          <p className="mt-2 text-sm text-gray-500">
            Edit this text input, then modify this component - your input will be preserved thanks to HMR!
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded border border-purple-200">
          <h3 className="font-semibold text-purple-800">About HMR in Float.js</h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc pl-5">
            <li>Updates code changes instantly without full page reload</li>
            <li>Maintains component state during development</li>
            <li>Provides faster feedback loop for UI changes</li>
            <li>Works seamlessly with the Float.js development server</li>
          </ul>
        </div>
      </div>
    </div>
  );
}