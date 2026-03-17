'use client';

import Layout from '@/components/Layout';
import { User } from 'lucide-react';

export default function MyNumbersPage() {
  return (
    <Layout>
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Numbers</h1>
        <p className="text-gray-600">Coming soon - Personal trading statistics analysis</p>
      </div>
    </Layout>
  );
}
