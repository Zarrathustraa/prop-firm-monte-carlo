export interface AppState {
  strategy: StrategyParams;
  selected_firm: string | null;
  selected_plan: string | null;
  selected_account_size: number | null;
  simulation_results: SimulationResults | null;
  is_simulating: boolean;
}

export interface ChartDataPoint {
  x: number;
  y: number;
  percentile?: string;
}

export interface EquityCurveData {
  trade_number: number;
  p5: number;
  p25: number;
  p50: number;
  p75: number;
  p95: number;
  profit_target: number;
  drawdown_floor: number;
}

export interface HeatmapDataPoint {
  win_rate: number;
  risk_reward: number;
  pass_rate: number;
  monthly_income: number;
}
