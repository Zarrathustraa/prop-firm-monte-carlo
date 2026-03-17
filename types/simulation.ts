export interface MonteCarloEngine {
  simulate(
    strategy: StrategyParams,
    account: AccountSize,
    firm_plan: PropFirmPlan,
    settings: SimulationSettings
  ): SimulationResults;
}

export interface TradeResult {
  is_win: boolean;
  points: number;
  pnl: number;
  running_equity: number;
  day_pnl: number;
  trade_day: number;
}

export interface DailyState {
  day_pnl: number;
  trades_today: number;
  consecutive_losses: number;
  stopped_for_day: boolean;
  dll_breached: boolean;
}

export interface PathState {
  equity: number;
  floor: number;
  floor_locked: boolean;
  max_equity: number;
  daily_state: DailyState;
  total_trades: number;
  resolution_type: 'none' | 'passed' | 'blown' | 'dll_hit' | 'expired';
}

export interface PathResult {
  passed: boolean;
  blown: boolean;
  dll_breached: boolean;
  neither: boolean;
  trades_to_resolution: number;
  final_equity: number;
  max_drawdown: number;
  equity_curve: number[];
  daily_pnls: number[];
  payout_amount: number;
  days_to_resolution: number;
}

export interface SimulationResults {
  // Primary Metrics
  pass_rate: number;
  blow_rate: number;
  dll_hit_rate: number;
  neither_rate: number;
  
  // Path Statistics
  median_trades_to_pass: number;
  p25_trades_to_pass: number;
  p75_trades_to_pass: number;
  
  // Financial Metrics
  expected_payout: number;
  expected_payout_if_passed: number;
  monthly_net_income: number;
  monthly_gross_income: number;
  total_monthly_fees: number;
  monthly_reset_costs: number;
  
  // Risk Metrics
  median_max_drawdown: number;
  p95_max_drawdown: number;
  recovery_factor: number;
  
  // Time Limit Metrics (when applicable)
  expired_rate?: number;
  pass_first_attempt_rate?: number;
  avg_attempts_to_pass?: number;
  avg_total_fees?: number;
  
  // Raw Data
  all_paths: PathResult[];
  equity_percentiles: {
    p5: number[];
    p25: number[];
    p50: number[];
    p75: number[];
    p95: number[];
  };
}

export interface StrategyParams {
  win_rate: number;
  avg_win_points: number;
  avg_loss_points: number;
  trades_per_day: number;
  win_std_dev: number;
  loss_std_dev: number;
  commission: number;
  slippage_points: number;
  
  // Risk Management
  enable_risk_management: boolean;
  first_cut_percentage: number;
  second_cut_percentage: number;
  
  // Trade Management
  enable_trade_management: boolean;
  breakeven_stop_trigger: number;
  trailing_stop_distance: number;
  partial_profit_percentage: number;
  partial_profit_trigger: number;
  
  // Daily Rules
  stop_after_win: boolean;
  extra_trades_after_loss: number;
  max_consecutive_losses: number;
  
  // Evaluation Window
  enable_time_limit: boolean;
  max_trading_days: number;
  allow_retries: boolean;
  max_retries: number;
}

export interface SimulationSettings {
  n_paths: number;
  n_trades_per_path: number;
  live_trailing_drawdown: boolean;
}

export interface PayoutCalculation {
  gross_profit: number;
  withdrawable_amount: number;
  payout_split_amount: number;
  capped_payout: number;
  final_payout: number;
  meets_minimum: boolean;
}