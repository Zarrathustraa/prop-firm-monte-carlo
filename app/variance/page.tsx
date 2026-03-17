'use client';

import Layout from '@/components/Layout';
import { Zap } from 'lucide-react';

export default function VariancePage() {
  return (
    <Layout>
      <div className="text-center py-12">
        <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Variance Impact</h1>
        <p className="text-gray-600">Coming soon - Win/loss variance analysis</p>
      </div>
    </Layout>
  );
}
