import './globals.css';
import React from 'react';

export const metadata = {
  title: 'NexoVisión Realtime',
  description: 'Información al instante',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen">
      <link rel="stylesheet" href="/globals.css" />
      <div className="max-w-[1200px] mx-auto min-h-screen border-x border-gray-100 shadow-sm">
        {children}
      </div>
    </div>
  );
}