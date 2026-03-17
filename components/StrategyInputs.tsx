import { useAppStore } from '@/lib/store';
import { calculateDerivedStats } from '@/lib/analytics';
import { formatCurrency, formatPoints, formatPercentage } from '@/lib/utils';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';

export default function StrategyInputs() {
  const { strategy, updateStrategy } = useAppStore();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [riskMgmtOpen, setRiskMgmtOpen] = useState(false);
  const [tradeMgmtOpen, setTradeMgmtOpen] = useState(false);
  const [dailyRulesOpen, setDailyRulesOpen] = useState(false);
  
  const derivedStats = calculateDerivedStats(strategy);
  
  const handleInputChange = (field: keyof typeof strategy, value: number | boolean) => {
    updateStrategy({ [field]: value });
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Strategy Parameters</h3>
      
      {/* Core Strategy Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Win Rate (%)
          </label>
          <input
            type="range"
            min="10"
            max="90"
            step="1"
            value={strategy.win_rate * 100}
            onChange={(e) => handleInputChange('win_rate', Number(e.target.value) / 100)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10%</span>
            <span className="font-medium">{(strategy.win_rate * 100).toFixed(0)}%</span>
            <span>90%</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avg Win (points)
          </label>
          <input
            type="range"
            min="1"
            max="200"
            step="1"
            value={strategy.avg_win_points}
            onChange={(e) => handleInputChange('avg_win_points', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 pt</span>
            <span className="font-medium">
              {formatPoints(strategy.avg_win_points)} ({formatCurrency(strategy.avg_win_points * 20)})
            </span>
            <span>200 pt</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avg Loss (points)
          </label>
          <input
            type="range"
            min="1"
            max="200"
            step="1"
            value={strategy.avg_loss_points}
            onChange={(e) => handleInputChange('avg_loss_points', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 pt</span>
            <span className="font-medium">
              {formatPoints(strategy.avg_loss_points)} ({formatCurrency(strategy.avg_loss_points * 20)})
            </span>
            <span>200 pt</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trades/Day
          </label>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={strategy.trades_per_day}
            onChange={(e) => handleInputChange('trades_per_day', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.1</span>
            <span className="font-medium">{strategy.trades_per_day.toFixed(1)}</span>
            <span>10</span>
          </div>
        </div>
      </div>
      
      {/* Derived Statistics */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Info className="h-4 w-4 mr-2 text-blue-600" />
          Derived Statistics
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">EV/Trade:</span>
            <div className="font-medium text-lg">
              {formatCurrency(derivedStats.ev_per_trade)}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Kelly %:</span>
            <div className="font-medium text-lg">
              {formatPercentage(derivedStats.kelly_percentage)}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Breakeven WR:</span>
            <div className="font-medium text-lg">
              {formatPercentage(derivedStats.breakeven_win_rate)}
            </div>
          </div>
          <div>
            <span className="text-gray-600">R:R Ratio:</span>
            <div className="font-medium text-lg">
              {derivedStats.risk_reward_ratio.toFixed(2)}:1
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced Settings */}
      <div className="border rounded-lg p-4">
        <button
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="font-medium text-gray-900">Advanced Settings</h4>
          {advancedOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {advancedOpen && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Win Std Dev (points)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={strategy.win_std_dev}
                  onChange={(e) => handleInputChange('win_std_dev', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {strategy.win_std_dev} pts
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loss Std Dev (points)
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={strategy.loss_std_dev}
                  onChange={(e) => handleInputChange('loss_std_dev', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {strategy.loss_std_dev} pts
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission ($)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={strategy.commission}
                  onChange={(e) => handleInputChange('commission', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-trading-blue focus:border-trading-blue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slippage (points)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.25"
                  value={strategy.slippage_points}
                  onChange={(e) => handleInputChange('slippage_points', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-trading-blue focus:border-trading-blue"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Preset Strategies */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Quick Presets</h4>
        <div className="flex space-x-2">
          <button
            onClick={() => updateStrategy({
              win_rate: 0.60,
              avg_win_points: 15,
              avg_loss_points: 15,
              trades_per_day: 5.0
            })}
            className="px-3 py-2 bg-gray-100 text-sm rounded-md hover:bg-gray-200 transition-colors"
          >
            Scalper (60% WR, 1:1, 5 TPD)
          </button>
          <button
            onClick={() => updateStrategy({
              win_rate: 0.45,
              avg_win_points: 30,
              avg_loss_points: 15,
              trades_per_day: 1.0
            })}
            className="px-3 py-2 bg-gray-100 text-sm rounded-md hover:bg-gray-200 transition-colors"
          >
            Swing (45% WR, 2:1, 1 TPD)
          </button>
          <button
            onClick={() => updateStrategy({
              win_rate: 0.50,
              avg_win_points: 30,
              avg_loss_points: 15,
              trades_per_day: 1.0
            })}
            className="px-3 py-2 bg-gray-100 text-sm rounded-md hover:bg-gray-200 transition-colors"
          >
            ICT (50% WR, 2:1, 1 TPD)
          </button>
        </div>
      </div>
    </div>
  );
}