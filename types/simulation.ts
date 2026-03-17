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

export interface PayoutCalculation {
  gross_profit: number;
  withdrawable_amount: number;
  payout_split_amount: number;
  capped_payout: number;
  final_payout: number;
  meets_minimum: boolean;
}
