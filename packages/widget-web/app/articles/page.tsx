'use client';
import React from 'react';
import { RealtimeArticleList } from '@maravilla/widgets';

export default function WidgetDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-5">
        <RealtimeArticleList />
      </div>
    </div>
  );
}