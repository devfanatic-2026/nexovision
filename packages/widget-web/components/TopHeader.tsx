import React from 'react';

export function TopHeader() {
    return (
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-800">Catalog Dashboard</h2>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">System Active</span>
            </div>
            <div className="flex items-center gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer">
                    Refresh Data
                </button>
            </div>
        </header>
    );
}
