import './globals.css';
import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { TopHeader } from '../components/TopHeader';

export const metadata = {
  title: 'NexoVision Widget Catalog',
  description: 'Explore our library of React Native widgets running on the web',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <TopHeader />


        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}