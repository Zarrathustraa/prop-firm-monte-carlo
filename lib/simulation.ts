import { StrategyParams, SimulationSettings, PathResult, SimulationResults, AccountSize, PropFirmPlan } from '@/types';
import { POINT_VALUE } from './firms';

export class MonteCarloEngine {
  private static instance: MonteCarloEngine;
  
  public static getInstance(): MonteCarloEngine {
    if (!MonteCarloEngine.instance) {
      MonteCarloEngine.instance = new MonteCarloEngine();
    }
    return MonteCarloEngine.instance;
  }

  public simulate(
    strategy: StrategyParams,
    account: AccountSize,
    firmPlan: PropFirmPlan,
    settings: SimulationSettings
  ): SimulationResults {
    const allPaths: PathResult[] = [];
    
    // Run Monte Carlo simulation
    for (let i = 0; i < settings.n_paths; i++) {
      const pathResult = this.simulatePath(strategy, account, firmPlan, settings);
      allPaths.push(pathResult);
    }
    
    return this.aggregateResults(allPaths, strategy, account, firmPlan);
  }

  private simulatePath(
    strategy: StrategyParams,
    account: AccountSize,
    firmPlan: PropFirmPlan,
    settings: SimulationSettings
  ): PathResult {
    let equity = account.size;
    let floor = account.size - account.trailing_drawdown;
    let floorLocked = false;
    let maxEquity = equity;
    let totalTrades = 0;
    let currentDay = 0;
    let dayPnl = 0;
    let consecutiveLosses = 0;
    let dayStopped = false;
    
    const equityCurve: number[] = [equity];
    const dailyPnls: number[] = [];
    let maxDrawdown = 0;
    
    let passed = false;
    let blown = false;
    let dllBreached = false;
    
    for (let tradeIdx = 0; tradeIdx < settings.n_trades_per_path; tradeIdx++) {
      const tradeDay = Math.floor(tradeIdx / strategy.trades_per_day);
      
      // Day boundary - EOD update
      if (tradeDay > currentDay) {
        if (firmPlan.drawdown_type === "eod_trailing") {
          floor = Math.max(floor, equity - account.trailing_drawdown);
          if (!floorLocked && floor >= account.size + 100) {
            floor = account.size + 100;
            floorLocked = true;
          }
        }
        
        // Store daily P&L and reset
        if (dayPnl !== 0) {
          dailyPnls.push(dayPnl);
        }
        dayPnl = 0;
        currentDay = tradeDay;
        dayStopped = false;
        consecutiveLosses = 0;
      }
      
      // Skip if day stopped due to rules
      if (dayStopped) continue;
      
      // Generate trade
      const isWin = Math.random() < strategy.win_rate;
      let points = isWin ? strategy.avg_win_points : -strategy.avg_loss_points;
      
      // Apply variance if enabled
      if (strategy.win_std_dev > 0 || strategy.loss_std_dev > 0) {
        const stdDev = isWin ? strategy.win_std_dev : strategy.loss_std_dev;
        const avgPoints = Math.abs(points);
        if (stdDev > 0) {
          const variance = this.normalRandom(1.0, stdDev / avgPoints);
          points *= Math.max(0.1, variance); // Prevent negative variance
        }
      }
      
      // Calculate P&L including costs
      const slippageCost = strategy.slippage_points * POINT_VALUE;
      const pnl = points * POINT_VALUE - strategy.commission - slippageCost;
      
      equity += pnl;
      dayPnl += pnl;
      totalTrades++;
      
      // Track max equity for drawdown calculation
      maxEquity = Math.max(maxEquity, equity);
      const currentDrawdown = maxEquity - equity;
      maxDrawdown = Math.max(maxDrawdown, currentDrawdown);
      
      // Intraday trailing floor update
      if (firmPlan.drawdown_type === "trailing_threshold") {
        floor = Math.max(floor, equity - account.trailing_drawdown);
        if (!floorLocked && floor >= account.size + 100) {
          floor = account.size + 100;
          floorLocked = true;
        }
      }
      
      equityCurve.push(equity);
      
      // Check if blown (hit floor)
      if (equity <= floor) {
        blown = true;
        break;
      }
      
      // Check daily loss limit
      if (account.daily_loss_limit && dayPnl <= -account.daily_loss_limit) {
        dllBreached = true;
        dayStopped = true;
        continue; // Don't break, just stop for today
      }
      
      // Check if passed (hit profit target)
      if (equity - account.size >= account.profit_target) {
        passed = true;
        break;
      }
      
      // Apply daily rules
      if (strategy.stop_after_win && isWin) {
        dayStopped = true;
      }
      
      if (!isWin) {
        consecutiveLosses++;
        if (strategy.max_consecutive_losses > 0 && consecutiveLosses >= strategy.max_consecutive_losses) {
          dayStopped = true;
        }
      } else {
        consecutiveLosses = 0;
      }
    }
    
    // Calculate payout if passed
    let payoutAmount = 0;
    if (passed) {
      payoutAmount = this.calculatePayout(equity - account.size, account, firmPlan);
    }
    
    return {
      passed,
      blown,
      dll_breached: dllBreached,
      neither: !passed && !blown,
      trades_to_resolution: totalTrades,
      final_equity: equity,
      max_drawdown: maxDrawdown,
      equity_curve: equityCurve,
      daily_pnls: dailyPnls,
      payout_amount: payoutAmount,
      days_to_resolution: Math.ceil(totalTrades / strategy.trades_per_day)
    };
  }
  
  private calculatePayout(profit: number, account: AccountSize, firmPlan: PropFirmPlan): number {
    // Calculate buffer
    let buffer = 0;
    if (firmPlan.payout_buffer_type === "dd_plus_100") {
      buffer = account.trailing_drawdown + 100;
    } else if (firmPlan.payout_buffer_type === "fixed" && firmPlan.payout_buffer_amount) {
      buffer = firmPlan.payout_buffer_amount;
    }
    
    const withdrawableAmount = Math.max(0, profit - buffer);
    const splitAmount = withdrawableAmount * firmPlan.payout_split;
    
    // Apply payout ladder cap (first payout)
    const firstPayoutCap = account.payout_ladder ? account.payout_ladder[0] : Number.MAX_SAFE_INTEGER;
    const cappedAmount = Math.min(splitAmount, firstPayoutCap);
    
    // Check minimum payout requirement
    const finalPayout = cappedAmount >= firmPlan.min_payout ? cappedAmount : 0;
    
    return finalPayout;
  }
  
  private aggregateResults(
    allPaths: PathResult[],
    strategy: StrategyParams,
    account: AccountSize,
    firmPlan: PropFirmPlan
  ): SimulationResults {
    const passingPaths = allPaths.filter(p => p.passed);
    const blownPaths = allPaths.filter(p => p.blown);
    const dllPaths = allPaths.filter(p => p.dll_breached);
    
    // Basic rates
    const passRate = passingPaths.length / allPaths.length;
    const blowRate = blownPaths.length / allPaths.length;
    const dllHitRate = dllPaths.length / allPaths.length;
    const neitherRate = 1 - passRate - blowRate;
    
    // Trade statistics
    const tradesArray = passingPaths.map(p => p.trades_to_resolution).sort((a, b) => a - b);
    const medianTradesToPass = tradesArray.length > 0 ? this.percentile(tradesArray, 50) : 0;
    const p25TradesToPass = tradesArray.length > 0 ? this.percentile(tradesArray, 25) : 0;
    const p75TradesToPass = tradesArray.length > 0 ? this.percentile(tradesArray, 75) : 0;
    
    // Financial metrics
    const expectedPayout = (passingPaths.reduce((sum, p) => sum + p.payout_amount, 0) / allPaths.length);
    const expectedPayoutIfPassed = passingPaths.length > 0 
      ? passingPaths.reduce((sum, p) => sum + p.payout_amount, 0) / passingPaths.length 
      : 0;
    
    // Monthly income calculation
    const daysToPassMedian = medianTradesToPass / strategy.trades_per_day;
    const monthsToPass = daysToPassMedian / 21; // 21 trading days per month
    
    const monthlyFees = (account.monthly_fee || 0) + (firmPlan.activation_fee || 0) / 3; // Amortize activation over 3 months
    const resetFee = account.eval_fee || 0;
    const resetCostPerMonth = (1 - passRate) * resetFee * (monthsToPass > 0 ? 1 / monthsToPass : 0);
    
    const payoutFreqMultiplier = firmPlan.payout_frequency === "weekly" ? 4 : 
                                 firmPlan.payout_frequency === "biweekly" ? 2 : 1;
    const monthlyGross = expectedPayout * payoutFreqMultiplier;
    const monthlyNet = monthlyGross - monthlyFees - resetCostPerMonth;
    
    // Risk metrics
    const drawdownArray = allPaths.map(p => p.max_drawdown).sort((a, b) => a - b);
    const medianMaxDrawdown = drawdownArray.length > 0 ? this.percentile(drawdownArray, 50) : 0;
    const p95MaxDrawdown = drawdownArray.length > 0 ? this.percentile(drawdownArray, 95) : 0;
    
    const recoveryFactor = passingPaths.length > 0 ? 
      (expectedPayoutIfPassed / Math.max(medianMaxDrawdown, 1)) : 0;
    
    // Equity percentiles for charting
    const maxCurveLength = Math.max(...allPaths.map(p => p.equity_curve.length));
    const equityPercentiles = {
      p5: this.calculateEquityPercentiles(allPaths, maxCurveLength, 5),
      p25: this.calculateEquityPercentiles(allPaths, maxCurveLength, 25),
      p50: this.calculateEquityPercentiles(allPaths, maxCurveLength, 50),
      p75: this.calculateEquityPercentiles(allPaths, maxCurveLength, 75),
      p95: this.calculateEquityPercentiles(allPaths, maxCurveLength, 95)
    };
    
    return {
      pass_rate: passRate * 100,
      blow_rate: blowRate * 100,
      dll_hit_rate: dllHitRate * 100,
      neither_rate: neitherRate * 100,
      
      median_trades_to_pass: medianTradesToPass,
      p25_trades_to_pass: p25TradesToPass,
      p75_trades_to_pass: p75TradesToPass,
      
      expected_payout: expectedPayout,
      expected_payout_if_passed: expectedPayoutIfPassed,
      monthly_net_income: monthlyNet,
      monthly_gross_income: monthlyGross,
      total_monthly_fees: monthlyFees,
      monthly_reset_costs: resetCostPerMonth,
      
      median_max_drawdown: medianMaxDrawdown,
      p95_max_drawdown: p95MaxDrawdown,
      recovery_factor: recoveryFactor,
      
      all_paths: allPaths,
      equity_percentiles: equityPercentiles
    };
  }
  
  private percentile(sortedArray: number[], p: number): number {
    if (sortedArray.length === 0) return 0;
    const index = (p / 100) * (sortedArray.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
  }
  
  private calculateEquityPercentiles(paths: PathResult[], maxLength: number, percentile: number): number[] {
    const result: number[] = [];
    
    for (let i = 0; i < maxLength; i++) {
      const valuesAtIndex: number[] = [];
      paths.forEach(path => {
        if (i < path.equity_curve.length) {
          valuesAtIndex.push(path.equity_curve[i]);
        }
      });
      
      if (valuesAtIndex.length > 0) {
        valuesAtIndex.sort((a, b) => a - b);
        result.push(this.percentile(valuesAtIndex, percentile));
      }
    }
    
    return result;
  }
  
  private normalRandom(mean: number, stdDev: number): number {
    // Box-Muller transformation for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  }
}

export const monteCarloEngine = MonteCarloEngine.getInstance();