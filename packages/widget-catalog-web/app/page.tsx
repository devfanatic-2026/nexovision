import React from 'react';

export default function WelcomePage() {
  return (
    <div className="max-w-3xl mx-auto text-center py-20">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
        Welcome to your Widget Library
      </h1>
      <p className="text-xl text-gray-600 mb-10 leading-relaxed">
        This catalog demonstrates 100% interoperability between <span className="font-semibold text-blue-600">Float.js Core</span> and <span className="font-semibold text-purple-600">React Native components</span>.
        Select a widget from the sidebar to begin exploring.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-2">SSR Optimized</h3>
          <p className="text-sm text-gray-500">The sidebar and navigation are rendered on the server for maximum performance and SEO.</p>
        </div>
        <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-2">Native Widgets</h3>
          <p className="text-sm text-gray-500">Widgets are built with React Native but run seamlessly on the web without code changes.</p>
        </div>
      </div>
    </div>
  );
}
