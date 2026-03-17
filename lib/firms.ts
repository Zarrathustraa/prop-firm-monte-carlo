import type { PropFirm } from '@/types';

export const PROP_FIRMS: PropFirm[] = [
  {
    id: "apex_eod",
    name: "Apex Trader Funding - EOD",
    plans: [{
      id: "apex_eod_standard",
      name: "Standard EOD Trailing",
      drawdown_type: "eod_trailing",
      payout_split: 1.0, // 100%
      consistency_rule: 50, // 50% rule in funded
      monthly_fee: 0, // Pay per eval attempt
      payout_frequency: "on_demand",
      max_payouts: 6, // Account closes after 6th payout
      payout_buffer_type: "dd_plus_100",
      min_payout: 500,
      withdrawal_impact: "none",
      max_funded_accounts: 20,
      account_sizes: [
        {
          size: 25000,
          profit_target: 1500,
          trailing_drawdown: 1000,
          daily_loss_limit: 500,
          max_contracts: 4,
          eval_fee: 29,
          min_daily_profit: 100,
          payout_ladder: [1000, 1000, 1000, 1000, 1000, 1000]
        },
        {
          size: 50000,
          profit_target: 3000,
          trailing_drawdown: 2000,
          daily_loss_limit: 1000,
          max_contracts: 6,
          eval_fee: 33,
          min_daily_profit: 250,
          payout_ladder: [1500, 1500, 2000, 2500, 2500, 3000]
        },
        {
          size: 100000,
          profit_target: 6000,
          trailing_drawdown: 3000,
          daily_loss_limit: 1500,
          max_contracts: 8,
          eval_fee: 41,
          min_daily_profit: 300,
          payout_ladder: [2000, 2500, 2500, 3000, 4000, 4000]
        },
        {
          size: 150000,
          profit_target: 9000,
          trailing_drawdown: 4000,
          daily_loss_limit: 2000,
          max_contracts: 12,
          eval_fee: 59,
          min_daily_profit: 350,
          payout_ladder: [2500, 3000, 3000, 3000, 4000, 5000]
        }
      ]
    }]
  },
  {
    id: "topstep",
    name: "TopstepTrader",
    plans: [{
      id: "topstep_standard",
      name: "TopstepX Standard",
      drawdown_type: "eod_trailing",
      payout_split: 0.9, // Changed from 100% first 10K then 90%
      monthly_fee: 49,
      activation_fee: 149,
      min_profitable_days: 5, // 5 days of $150+ each
      payout_frequency: "on_demand",
      max_payout_per_cycle: 5000,
      payout_buffer_type: "none",
      min_payout: 125,
      withdrawal_impact: "resets_mll", // Most punishing mechanic
      max_funded_accounts: 5,
      account_sizes: [
        {
          size: 50000,
          profit_target: 3000,
          trailing_drawdown: 2000,
          daily_loss_limit: 1000,
          max_contracts: 5,
          monthly_fee: 49,
        },
        {
          size: 100000,
          profit_target: 6000,
          trailing_drawdown: 3000,
          daily_loss_limit: 2000,
          max_contracts: 10,
          monthly_fee: 99,
        },
        {
          size: 150000,
          profit_target: 9000,
          trailing_drawdown: 4500,
          daily_loss_limit: 3000,
          max_contracts: 15,
          monthly_fee: 149,
        }
      ]
    }]
  }
];

export const POINT_VALUE = 20; // MNQ point value in dollars
export const DEFAULT_COMMISSION = 0.62; // Rithmic default
export const DEFAULT_SLIPPAGE = 0.25; // points

export function getFirmById(id: string): PropFirm | undefined {
  return PROP_FIRMS.find(firm => firm.id === id);
}

export function getPlanById(firmId: string, planId: string) {
  const firm = getFirmById(firmId);
  return firm?.plans.find(plan => plan.id === planId);
}

export function getAccountSize(firmId: string, planId: string, size: number) {
  const plan = getPlanById(firmId, planId);
  return plan?.account_sizes.find(account => account.size === size);
}