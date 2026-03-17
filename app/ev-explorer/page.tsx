'use client';

import Layout from '@/components/Layout';
import { TrendingUp } from 'lucide-react';

export default function EVExplorerPage() {
  return (
    <Layout>
      <div className="text-center py-12">
        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">EV Explorer</h1>
        <p className="text-gray-600">Coming soon - Interactive EV analysis tools</p>
      </div>
    </Layout>
  );
}
