import type { PropFirm } from '@/types';

export const PROP_FIRMS: PropFirm[] = [
  {
    id: "apex_eod",
    name: "Apex Trader Funding - EOD",
    plans: [{
      id: "apex_eod_standard",
      name: "Standard EOD Trailing",
      drawdown_type: "eod_trailing",
      payout_split: 1.0,
      consistency_rule: 50,
      monthly_fee: 0,
      payout_frequency: "on_demand",
      max_payouts: 6,
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
          payout_ladder: [1000, 1000, 1000, 1000, 1000, 1000],
          scaling_tiers: [
            { profit_level: [0, 999], max_contracts: 1, daily_loss_limit: 500 },
            { profit_level: [1000, 1999], max_contracts: 2, daily_loss_limit: 500 },
            { profit_level: [2000, 999999], max_contracts: 2, daily_loss_limit: 1250 }
          ]
        },
        {
          size: 50000,
          profit_target: 3000,
          trailing_drawdown: 2000,
          daily_loss_limit: 1000,
          max_contracts: 6,
          eval_fee: 33,
          min_daily_profit: 250,
          payout_ladder: [1500, 1500, 2000, 2500, 2500, 3000],
          scaling_tiers: [
            { profit_level: [0, 1499], max_contracts: 2, daily_loss_limit: 1000 },
            { profit_level: [1500, 2999], max_contracts: 3, daily_loss_limit: 1000 },
            { profit_level: [3000, 5999], max_contracts: 4, daily_loss_limit: 2000 },
            { profit_level: [6000, 999999], max_contracts: 4, daily_loss_limit: 3000 }
          ]
        },
        {
          size: 100000,
          profit_target: 6000,
          trailing_drawdown: 3000,
          daily_loss_limit: 1500,
          max_contracts: 8,
          eval_fee: 41,
          min_daily_profit: 300,
          payout_ladder: [2000, 2500, 2500, 3000, 4000, 4000],
          scaling_tiers: [
            { profit_level: [0, 1999], max_contracts: 3, daily_loss_limit: 1750 },
            { profit_level: [2000, 2999], max_contracts: 4, daily_loss_limit: 1750 },
            { profit_level: [3000, 4999], max_contracts: 5, daily_loss_limit: 1750 },
            { profit_level: [5000, 9999], max_contracts: 6, daily_loss_limit: 2500 },
            { profit_level: [10000, 999999], max_contracts: 6, daily_loss_limit: 3500 }
          ]
        },
        {
          size: 150000,
          profit_target: 9000,
          trailing_drawdown: 4000,
          daily_loss_limit: 2000,
          max_contracts: 12,
          eval_fee: 59,
          min_daily_profit: 350,
          payout_ladder: [2500, 3000, 3000, 3000, 4000, 5000],
          scaling_tiers: [
            { profit_level: [0, 1999], max_contracts: 4, daily_loss_limit: 2500 },
            { profit_level: [2000, 2999], max_contracts: 5, daily_loss_limit: 2500 },
            { profit_level: [3000, 4999], max_contracts: 7, daily_loss_limit: 2500 },
            { profit_level: [5000, 9999], max_contracts: 10, daily_loss_limit: 3000 },
            { profit_level: [10000, 999999], max_contracts: 10, daily_loss_limit: 4000 }
          ]
        }
      ]
    }]
  },
  {
    id: "apex_intraday",
    name: "Apex Trader Funding - Intraday",
    plans: [{
      id: "apex_intraday_standard",
      name: "Intraday Trailing",
      drawdown_type: "trailing_threshold",
      payout_split: 1.0,
      consistency_rule: 50,
      monthly_fee: 0,
      payout_frequency: "on_demand",
      max_payouts: 6,
      payout_buffer_type: "dd_plus_100",
      min_payout: 500,
      withdrawal_impact: "none",
      max_funded_accounts: 20,
      account_sizes: [
        {
          size: 25000,
          profit_target: 1500,
          trailing_drawdown: 1000,
          max_contracts: 4,
          eval_fee: 29,
          payout_ladder: [1000, 1000, 1000, 1000, 1000, 1000]
        },
        {
          size: 50000,
          profit_target: 3000,
          trailing_drawdown: 2000,
          max_contracts: 6,
          eval_fee: 33,
          payout_ladder: [1500, 1500, 2000, 2500, 2500, 3000]
        },
        {
          size: 100000,
          profit_target: 6000,
          trailing_drawdown: 3000,
          max_contracts: 8,
          eval_fee: 41,
          payout_ladder: [2000, 2500, 2500, 3000, 4000, 4000]
        },
        {
          size: 150000,
          profit_target: 9000,
          trailing_drawdown: 4000,
          max_contracts: 12,
          eval_fee: 59,
          payout_ladder: [2500, 3000, 3000, 3000, 4000, 5000]
        }
      ]
    }]
  },
  {
    id: "mff_core",
    name: "MyFundedFutures - Core",
    plans: [{
      id: "mff_core_standard",
      name: "Core Plan",
      drawdown_type: "eod_trailing",
      payout_split: 0.8,
      consistency_rule: 40,
      monthly_fee: 77,
      min_profitable_days: 5,
      payout_frequency: "monthly",
      max_payout_per_cycle: 5000,
      payout_buffer_type: "none",
      min_payout: 250,
      withdrawal_impact: "none",
      account_sizes: [{
        size: 50000,
        profit_target: 3000,
        trailing_drawdown: 1500,
        max_contracts: 5,
        monthly_fee: 77
      }]
    }]
  },
  {
    id: "mff_rapid",
    name: "MyFundedFutures - Rapid",
    plans: [{
      id: "mff_rapid_standard",
      name: "Rapid Plan",
      drawdown_type: "trailing_threshold",
      payout_split: 0.9,
      monthly_fee: 129,
      min_profitable_days: 5,
      payout_frequency: "monthly",
      max_payout_per_cycle: 11250,
      payout_buffer_type: "fixed",
      payout_buffer_amount: 2100,
      min_payout: 250,
      withdrawal_impact: "none",
      account_sizes: [
        {
          size: 50000,
          profit_target: 3000,
          trailing_drawdown: 2000,
          max_contracts: 5,
          monthly_fee: 129
        },
        {
          size: 100000,
          profit_target: 6000,
          trailing_drawdown: 4000,
          max_contracts: 10,
          monthly_fee: 229
        },
        {
          size: 150000,
          profit_target: 9000,
          trailing_drawdown: 6000,
          max_contracts: 15,
          monthly_fee: 329
        }
      ]
    }]
  },
  {
    id: "mff_pro",
    name: "MyFundedFutures - Pro",
    plans: [{
      id: "mff_pro_standard",
      name: "Pro Plan",
      drawdown_type: "eod_trailing",
      payout_split: 0.8,
      monthly_fee: 229,
      payout_frequency: "biweekly",
      max_payout_per_cycle: 100000,
      payout_buffer_type: "none",
      min_payout: 1000,
      withdrawal_impact: "none",
      account_sizes: [
        {
          size: 50000,
          profit_target: 3000,
          trailing_drawdown: 1500,
          max_contracts: 5,
          monthly_fee: 229
        },
        {
          size: 100000,
          profit_target: 6000,
          trailing_drawdown: 3000,
          max_contracts: 10,
          monthly_fee: 329
        },
        {
          size: 150000,
          profit_target: 9000,
          trailing_drawdown: 4500,
          max_contracts: 15,
          monthly_fee: 477
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
      payout_split: 0.9,
      monthly_fee: 49,
      activation_fee: 149,
      min_profitable_days: 5,
      payout_frequency: "on_demand",
      max_payout_per_cycle: 5000,
      payout_buffer_type: "none",
      min_payout: 125,
      withdrawal_impact: "resets_mll",
      max_funded_accounts: 5,
      account_sizes: [
        {
          size: 50000,
          profit_target: 3000,
          trailing_drawdown: 2000,
          daily_loss_limit: 1000,
          max_contracts: 5,
          monthly_fee: 49
        },
        {
          size: 100000,
          profit_target: 6000,
          trailing_drawdown: 3000,
          daily_loss_limit: 2000,
          max_contracts: 10,
          monthly_fee: 99
        },
        {
          size: 150000,
          profit_target: 9000,
          trailing_drawdown: 4500,
          daily_loss_limit: 3000,
          max_contracts: 15,
          monthly_fee: 149
        }
      ]
    }]
  },
  {
    id: "lucid_pro",
    name: "Lucid Trading - Pro",
    plans: [{
      id: "lucid_pro_standard",
      name: "Pro Plan",
      drawdown_type: "eod_trailing",
      payout_split: 0.9,
      consistency_rule: 40,
      min_profitable_days: 0,
      payout_frequency: "on_demand",
      payout_buffer_type: "fixed",
      payout_buffer_amount: 2100,
      min_payout: 500,
      withdrawal_impact: "none",
      max_funded_accounts: 5,
      account_sizes: [
        {
          size: 25000,
          profit_target: 1250,
          trailing_drawdown: 1000,
          max_contracts: 2,
          eval_fee: 135,
          payout_ladder: [2000, 2000, 2500, 2500, 2500, 2500]
        },
        {
          size: 50000,
          profit_target: 3000,
          trailing_drawdown: 2000,
          daily_loss_limit: 1200,
          max_contracts: 4,
          eval_fee: 185,
          payout_ladder: [2000, 2000, 2500, 2500, 2500, 2500]
        },
        {
          size: 100000,
          profit_target: 6000,
          trailing_drawdown: 3000,
          daily_loss_limit: 1800,
          max_contracts: 6,
          eval_fee: 285,
          payout_ladder: [2000, 2000, 2500, 2500, 2500, 2500]
        },
        {
          size: 150000,
          profit_target: 9000,
          trailing_drawdown: 4500,
          daily_loss_limit: 2700,
          max_contracts: 10,
          eval_fee: 370,
          payout_ladder: [2000, 2000, 2500, 2500, 2500, 2500]
        }
      ]
    }]
  },
  {
    id: "aqua_standard",
    name: "AquaFutures - Standard",
    plans: [{
      id: "aqua_standard_plan",
      name: "Standard Plan",
      drawdown_type: "eod_trailing",
      payout_split: 1.0, // First 15K at 100%, then 90%
      consistency_rule: 40,
      monthly_fee: 114,
      payout_frequency: "biweekly",
      payout_buffer_type: "dd_plus_100",
      min_payout: 250,
      withdrawal_impact: "none",
      max_funded_accounts: 3,
      account_sizes: [
        {
          size: 25000,
          profit_target: 1500,
          trailing_drawdown: 1500,
          max_contracts: 2,
          monthly_fee: 114
        },
        {
          size: 50000,
          profit_target: 3000,
          trailing_drawdown: 2500,
          max_contracts: 5,
          monthly_fee: 195
        },
        {
          size: 100000,
          profit_target: 6000,
          trailing_drawdown: 3000,
          max_contracts: 10,
          monthly_fee: 345
        },
        {
          size: 150000,
          profit_target: 9000,
          trailing_drawdown: 5000,
          max_contracts: 15,
          monthly_fee: 490
        }
      ]
    }]
  },
  {
    id: "tradeify",
    name: "Tradeify - Growth",
    plans: [{
      id: "tradeify_growth",
      name: "Growth Plan",
      drawdown_type: "eod_trailing",
      payout_split: 1.0, // First 15K at 100%, then 90%
      consistency_rule: 35,
      monthly_fee: 139,
      max_payout_per_cycle: 25000,
      min_profitable_days: 1,
      payout_frequency: "monthly",
      payout_buffer_type: "dd_plus_100",
      min_payout: 500,
      withdrawal_impact: "none",
      account_sizes: [
        {
          size: 50000,
          profit_target: 3000,
          trailing_drawdown: 2000,
          daily_loss_limit: 1250,
          max_contracts: 4,
          monthly_fee: 139
        },
        {
          size: 100000,
          profit_target: 6000,
          trailing_drawdown: 4000,
          daily_loss_limit: 2500,
          max_contracts: 8,
          monthly_fee: 249
        },
        {
          size: 150000,
          profit_target: 9000,
          trailing_drawdown: 6000,
          daily_loss_limit: 3750,
          max_contracts: 12,
          monthly_fee: 339
        }
      ]
    }]
  }
];

export const POINT_VALUE = 20;
export const DEFAULT_COMMISSION = 0.62;
export const DEFAULT_SLIPPAGE = 0.25;

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