import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StrategyParams, SimulationResults } from '@/types/simulation';
import { DEFAULT_COMMISSION, DEFAULT_SLIPPAGE } from './firms';

export interface AppState {
  // Strategy parameters
  strategy: StrategyParams;
  updateStrategy: (updates: Partial<StrategyParams>) => void;

  // Firm selection
  selectedFirm: string | null;
  selectedPlan: string | null;
  selectedAccountSize: number | null;
  setFirmSelection: (firmId: string, planId: string, accountSize: number) => void;

  // Simulation state
  simulationResults: SimulationResults | null;
  isSimulating: boolean;
  setSimulationResults: (results: SimulationResults | null) => void;
  setIsSimulating: (simulating: boolean) => void;

  // UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const defaultStrategy: StrategyParams = {
  win_rate: 0.50,
  avg_win_points: 30,
  avg_loss_points: 15,
  trades_per_day: 1.0,
  win_std_dev: 0,
  loss_std_dev: 0,
  commission: DEFAULT_COMMISSION,
  slippage_points: DEFAULT_SLIPPAGE,

  enable_risk_management: false,
  first_cut_percentage: 50,
  second_cut_percentage: 25,

  enable_trade_management: false,
  breakeven_stop_trigger: 1.0,
  trailing_stop_distance: 1.0,
  partial_profit_percentage: 50,
  partial_profit_trigger: 2.0,

  stop_after_win: false,
  extra_trades_after_loss: 0,
  max_consecutive_losses: 0,

  enable_time_limit: false,
  max_trading_days: 30,
  allow_retries: false,
  max_retries: 3
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      strategy: defaultStrategy,
      selectedFirm: null,
      selectedPlan: null,
      selectedAccountSize: null,
      simulationResults: null,
      isSimulating: false,
      activeTab: 'simulator',

      updateStrategy: (updates) =>
        set((state) => ({
          strategy: { ...state.strategy, ...updates }
        })),

      setFirmSelection: (firmId, planId, accountSize) =>
        set({
          selectedFirm: firmId,
          selectedPlan: planId,
          selectedAccountSize: accountSize,
          simulationResults: null // Clear results when firm changes
        }),

      setSimulationResults: (results) =>
        set({ simulationResults: results }),

      setIsSimulating: (simulating) =>
        set({ isSimulating: simulating }),

      setActiveTab: (tab) =>
        set({ activeTab: tab })
    }),
    {
      name: 'prop-firm-simulator',
      partialize: (state) => ({
        strategy: state.strategy,
        selectedFirm: state.selectedFirm,
        selectedPlan: state.selectedPlan,
        selectedAccountSize: state.selectedAccountSize,
        activeTab: state.activeTab
      })
    }
  )
);
