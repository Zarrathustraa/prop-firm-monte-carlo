import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Prop Firm Monte Carlo Simulator',
  description: 'Professional-grade Monte Carlo simulator for futures prop trading firm evaluations',
  keywords: [
    'prop trading',
    'futures trading', 
    'monte carlo',
    'risk management',
    'MNQ',
    'trading simulator',
    'prop firm',
    'evaluation'
  ],
  authors: [{ name: 'Trading Quant Tools' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1B3A5C',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
