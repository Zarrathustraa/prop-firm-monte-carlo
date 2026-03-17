import type { SimulationResults, AccountSize, PropFirmPlan } from '@/types';
import MetricCard from './MetricCard';
import EquityCurveChart from './EquityCurveChart';
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Target,
  DollarSign,
  Clock,
  BarChart3
} from 'lucide-react';

interface SimulationResultsDisplayProps {
  results: SimulationResults;
  account: AccountSize;
  firmPlan: PropFirmPlan;
}

export default function SimulationResultsDisplay({ results, account, firmPlan }: SimulationResultsDisplayProps) {
  const getTrendForRate = (rate: number): 'positive' | 'negative' | 'neutral' => {
    if (rate > 60) return 'positive';
    if (rate < 40) return 'negative';
    return 'neutral';
  };
  
  return (
    <div className="space-y-6">
      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Pass Rate"
          value={formatPercentage(results.pass_rate / 100)}
          subtitle={`${formatNumber(results.pass_rate * results.all_paths.length / 100, 0)} of ${results.all_paths.length} paths`}
          icon={Target}
          trend={getTrendForRate(results.pass_rate)}
          tooltip="Percentage of simulation paths that hit the profit target before hitting the drawdown floor"
        />
        
        <MetricCard
          title="Blow Rate"
          value={formatPercentage(results.blow_rate / 100)}
          subtitle={`${formatNumber(results.blow_rate * results.all_paths.length / 100, 0)} paths blown`}
          icon={TrendingDown}
          trend={results.blow_rate > 40 ? 'negative' : results.blow_rate < 20 ? 'positive' : 'neutral'}
          tooltip="Percentage of paths that hit the trailing drawdown floor"
        />
        
        <MetricCard
          title="DLL Hit Rate"
          value={formatPercentage(results.dll_hit_rate / 100)}
          subtitle={account.daily_loss_limit ? "Daily loss limit triggered" : "No DLL for this account"}
          icon={AlertTriangle}
          trend={results.dll_hit_rate > 30 ? 'negative' : results.dll_hit_rate < 10 ? 'positive' : 'neutral'}
          tooltip="Percentage of paths where the daily loss limit was triggered at least once"
        />
        
        <MetricCard
          title="Median Trades to Pass"
          value={formatNumber(results.median_trades_to_pass, 0)}
          subtitle={`${formatNumber(results.median_trades_to_pass / (results.all_paths.length > 0 ? results.all_paths[0]?.equity_curve.length || 1 : 1), 1)} days`}
          icon={Clock}
          trend="neutral"
          tooltip="Typical number of trades needed to reach the profit target (among passing paths)"
        />
      </div>
      
      {/* Financial Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Expected Payout"
          value={formatCurrency(results.expected_payout)}
          subtitle="Per evaluation attempt"
          icon={DollarSign}
          trend={results.expected_payout > 0 ? 'positive' : 'negative'}
          tooltip="Average payout amount across all simulation paths (including zeros for failed paths)"
        />
        
        <MetricCard
          title="Monthly Net Income"
          value={formatCurrency(results.monthly_net_income)}
          subtitle={`Gross: ${formatCurrency(results.monthly_gross_income)}`}
          icon={TrendingUp}
          trend={results.monthly_net_income > 0 ? 'positive' : 'negative'}
          tooltip="Expected monthly income after fees and reset costs"
        />
        
        <MetricCard
          title="Total Monthly Fees"
          value={formatCurrency(results.total_monthly_fees)}
          subtitle={`Reset costs: ${formatCurrency(results.monthly_reset_costs)}`}
          icon={BarChart3}
          trend="neutral"
          tooltip="Monthly subscription fees plus amortized activation fees plus expected reset costs"
        />
      </div>
      
      {/* Insight Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Key Insights</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            • At your current strategy EV of {formatCurrency(results.expected_payout)}, 
            you need ~{formatNumber(results.median_trades_to_pass, 0)} trades = 
            ~{formatNumber(results.median_trades_to_pass / (results.all_paths[0]?.equity_curve.length || 21), 1)} months to pass
          </p>
          <p>
            • {formatPercentage(results.pass_rate / 100)} of traders with your stats would pass on first attempt
          </p>
          {results.expected_payout_if_passed > 0 && (
            <p>
              • If you do pass, expected first payout: {formatCurrency(results.expected_payout_if_passed)}
            </p>
          )}
        </div>
      </div>
      
      {/* Equity Curve Chart */}
      <EquityCurveChart results={results} accountSize={account} />
      
      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Median Max Drawdown"
          value={formatCurrency(results.median_max_drawdown)}
          subtitle="Typical worst case"
          icon={TrendingDown}
          trend="neutral"
          tooltip="Median peak-to-trough drawdown across all simulation paths"
        />
        
        <MetricCard
          title="P95 Max Drawdown"
          value={formatCurrency(results.p95_max_drawdown)}
          subtitle="5% worst case scenario"
          icon={TrendingDown}
          trend="negative"
          tooltip="95th percentile worst-case drawdown (only 5% of paths are worse)"
        />
        
        <MetricCard
          title="Recovery Factor"
          value={results.recovery_factor.toFixed(2)}
          subtitle="Net profit / max DD"
          icon={TrendingUp}
          trend={results.recovery_factor > 2 ? 'positive' : results.recovery_factor > 1 ? 'neutral' : 'negative'}
          tooltip="Ratio of expected net profit to maximum drawdown for passing paths"
        />
      </div>
      
      {/* Distribution Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Path Outcomes Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-trading-green">
              {formatNumber(results.pass_rate * results.all_paths.length / 100, 0)}
            </div>
            <div className="text-sm text-gray-600">Passed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-trading-red">
              {formatNumber(results.blow_rate * results.all_paths.length / 100, 0)}
            </div>
            <div className="text-sm text-gray-600">Blown</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-trading-amber">
              {formatNumber(results.dll_hit_rate * results.all_paths.length / 100, 0)}
            </div>
            <div className="text-sm text-gray-600">Hit DLL</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">
              {formatNumber(results.neither_rate * results.all_paths.length / 100, 0)}
            </div>
            <div className="text-sm text-gray-600">Incomplete</div>
          </div>
        </div>
      </div>
    </div>
  );
}