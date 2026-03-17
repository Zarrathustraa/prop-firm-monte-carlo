import type { SimulationResults } from '@/types/simulation';
import { AccountSize } from '@/types/firm';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface EquityCurveChartProps {
  results: SimulationResults;
  accountSize: AccountSize;
}

export default function EquityCurveChart({ results, accountSize }: EquityCurveChartProps) {
  // Prepare data for the equity fan chart
  const chartData = results.equity_percentiles.p50.map((_, index) => ({
    trade: index,
    p5: results.equity_percentiles.p5[index],
    p25: results.equity_percentiles.p25[index],
    p50: results.equity_percentiles.p50[index],
    p75: results.equity_percentiles.p75[index],
    p95: results.equity_percentiles.p95[index],
    profitTarget: accountSize.size + accountSize.profit_target,
    drawdownFloor: accountSize.size - accountSize.trailing_drawdown
  }));
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Trade ${label}`}</p>
          <div className="space-y-1 text-sm">
            <p style={{ color: '#10B981' }}>
              P95: {formatCurrency(payload.find((p: any) => p.dataKey === 'p95')?.value || 0)}
            </p>
            <p style={{ color: '#3B82F6' }}>
              P75: {formatCurrency(payload.find((p: any) => p.dataKey === 'p75')?.value || 0)}
            </p>
            <p style={{ color: '#6B7280' }}>
              P50: {formatCurrency(payload.find((p: any) => p.dataKey === 'p50')?.value || 0)}
            </p>
            <p style={{ color: '#3B82F6' }}>
              P25: {formatCurrency(payload.find((p: any) => p.dataKey === 'p25')?.value || 0)}
            </p>
            <p style={{ color: '#EF4444' }}>
              P5: {formatCurrency(payload.find((p: any) => p.dataKey === 'p5')?.value || 0)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full h-96 bg-white rounded-lg border p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Equity Curve Fan Chart
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="trade" 
            stroke="#6B7280"
            fontSize={12}
            tickFormatter={(value) => `T${value}`}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          
          {/* Reference lines */}
          <ReferenceLine 
            y={accountSize.size + accountSize.profit_target} 
            stroke="#00C851" 
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{ value: "Profit Target", position: "left" }}
          />
          <ReferenceLine 
            y={accountSize.size - accountSize.trailing_drawdown} 
            stroke="#FF4444" 
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{ value: "Drawdown Floor", position: "left" }}
          />
          
          {/* Percentile bands */}
          <Area
            type="monotone"
            dataKey="p95"
            stackId="1"
            stroke="none"
            fill="#D1FAE5"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="p75"
            stackId="1"
            stroke="none"
            fill="#A7F3D0"
            fillOpacity={0.4}
          />
          <Area
            type="monotone"
            dataKey="p25"
            stackId="1"
            stroke="none"
            fill="#FEE2E2"
            fillOpacity={0.4}
          />
          <Area
            type="monotone"
            dataKey="p5"
            stackId="1"
            stroke="none"
            fill="#FECACA"
            fillOpacity={0.3}
          />
          
          {/* Median line */}
          <Line
            type="monotone"
            dataKey="p50"
            stroke="#1B3A5C"
            strokeWidth={2}
            dot={false}
          />
          
          <Tooltip content={<CustomTooltip />} />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-200 rounded"></div>
          <span>P75-P95 (Good outcomes)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-1 bg-trading-blue"></div>
          <span>P50 (Median)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-200 rounded"></div>
          <span>P5-P25 (Bad outcomes)</span>
        </div>
      </div>
    </div>
  );
}