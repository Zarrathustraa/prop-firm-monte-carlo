import type { StrategyParams, DerivedStats } from '@/types';
import { POINT_VALUE } from './firms';

export function calculateDerivedStats(strategy: StrategyParams): DerivedStats {
  const avgWinDollars = strategy.avg_win_points * POINT_VALUE;
  const avgLossDollars = strategy.avg_loss_points * POINT_VALUE;
  const slippageCost = strategy.slippage_points * POINT_VALUE;
  
  // Expected Value per trade
  const ev_per_trade = (
    strategy.win_rate * avgWinDollars - 
    (1 - strategy.win_rate) * avgLossDollars - 
    strategy.commission - 
    slippageCost
  );
  
  // Kelly Criterion percentage
  const riskRewardRatio = strategy.avg_win_points / strategy.avg_loss_points;
  const kelly_percentage = strategy.win_rate - (1 - strategy.win_rate) / riskRewardRatio;
  
  // Breakeven win rate
  const breakeven_win_rate = strategy.avg_loss_points / (strategy.avg_win_points + strategy.avg_loss_points);
  
  return {
    ev_per_trade,
    kelly_percentage: Math.max(0, kelly_percentage), // Don't show negative Kelly
    breakeven_win_rate,
    risk_reward_ratio: riskRewardRatio,
    point_value: POINT_VALUE
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPoints(points: number): string {
  return `${points.toFixed(1)} pts`;
}

export function formatPointsAndDollars(points: number): string {
  const dollars = points * POINT_VALUE;
  return `${formatPoints(points)} (${formatCurrency(dollars)})`;
}

export function formatPercentage(decimal: number): string {
  return `${(decimal * 100).toFixed(1)}%`;
}