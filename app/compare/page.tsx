'use client';

import Layout from '@/components/Layout';
import { GitCompare } from 'lucide-react';

export default function ComparePage() {
  return (
    <Layout>
      <div className="text-center py-12">
        <GitCompare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Firm Comparison</h1>
        <p className="text-gray-600">Coming soon - Side-by-side firm analysis</p>
      </div>
    </Layout>
  );
}
