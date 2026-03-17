import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  TrendingUp, 
  GitCompare, 
  User, 
  Zap,
  Search,
  Building2
} from 'lucide-react';

const navigation = [
  { name: 'Simulator', href: '/simulator', icon: BarChart3 },
  { name: 'EV Explorer', href: '/ev-explorer', icon: TrendingUp },
  { name: 'Compare Firms', href: '/compare', icon: GitCompare },
  { name: 'My Numbers', href: '/my-numbers', icon: User },
  { name: 'Variance Impact', href: '/variance', icon: Zap },
  { name: 'Firm Picker', href: '/firm-picker', icon: Search }
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-trading-blue" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Prop Firm Monte Carlo
                </h1>
                <p className="text-sm text-gray-500">MNQ Futures | $20/point</p>
              </div>
            </div>

            <nav className="hidden md:flex space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-trading-blue text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <div className="md:hidden bg-white border-b">
        <div className="px-4 py-3 overflow-x-auto">
          <nav className="flex space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-trading-blue text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
