import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: 'positive' | 'negative' | 'neutral';
  className?: string;
  tooltip?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = 'neutral',
  className,
  tooltip
}: MetricCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'positive': return 'text-trading-green';
      case 'negative': return 'text-trading-red';
      default: return 'text-gray-900';
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm border p-6 transition-shadow hover:shadow-md",
        className
      )}
      title={tooltip}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={cn("text-2xl font-bold mt-1", getTrendColor())}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <Icon className="h-5 w-5 text-gray-400" />
        )}
      </div>
    </div>
  );
}
