'use client';
import React from 'react';
import { RealtimeArticleList } from '@nexovision/widgets-catalog';

export default function WidgetDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-5">
        <RealtimeArticleList />
      </div>
    </div>
  );
}