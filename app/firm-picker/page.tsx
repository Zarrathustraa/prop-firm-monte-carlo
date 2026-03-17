'use client';

import Layout from '@/components/Layout';
import { Search } from 'lucide-react';

export default function FirmPickerPage() {
  return (
    <Layout>
      <div className="text-center py-12">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Firm Picker</h1>
        <p className="text-gray-600">Coming soon - AI-powered firm recommendation engine</p>
      </div>
    </Layout>
  );
}
