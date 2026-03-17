'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { monteCarloEngine } from '@/lib/simulation';
import { getFirmById, getPlanById, getAccountSize } from '@/lib/firms';
import Layout from '@/components/Layout';
import FirmSelector from '@/components/FirmSelector';
import StrategyInputs from '@/components/StrategyInputs';
import SimulationResults from '@/components/SimulationResults';
import { Play, Loader2 } from 'lucide-react';

export default function SimulatorPage() {
  const {
    strategy,
    selectedFirm,
    selectedPlan,
    selectedAccountSize,
    simulationResults,
    isSimulating,
    setSimulationResults,
    setIsSimulating
  } = useAppStore();

  const [simulationSettings] = useState({
    n_paths: 2000,
    n_trades_per_path: 500,
    live_trailing_drawdown: false
  });

  const selectedFirmData = selectedFirm ? getFirmById(selectedFirm) : null;
  const selectedPlanData = selectedFirm && selectedPlan ? 
    getPlanById(selectedFirm, selectedPlan) : null;
  const selectedAccountData = selectedFirm && selectedPlan && selectedAccountSize ? 
    getAccountSize(selectedFirm, selectedPlan, selectedAccountSize) : null;

  const canRunSimulation = selectedFirmData && selectedPlanData && selectedAccountData;

  const runSimulation = async () => {
    if (!canRunSimulation) return;

    setIsSimulating(true);
    setSimulationResults(null);

    try {
      // Run simulation in a setTimeout to allow UI to update
      setTimeout(() => {
        const results = monteCarloEngine.simulate(
          strategy,
          selectedAccountData,
          selectedPlanData,
          simulationSettings
        );

        setSimulationResults(results);
        setIsSimulating(false);
      }, 100);
    } catch (error) {
      console.error('Simulation error:', error);
      setIsSimulating(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Monte Carlo Simulator</h1>
          <p className="mt-2 text-gray-600">
            Professional-grade simulation tool for prop trading firm evaluations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <FirmSelector />
            <StrategyInputs />

            {/* Run Simulation Button */}
            <div className="pt-6">
              <button
                onClick={runSimulation}
                disabled={!canRunSimulation || isSimulating}
                className="w-full flex items-center justify-center px-4 py-3 bg-trading-blue text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                {isSimulating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running Simulation...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Monte Carlo
                  </>
                )}
              </button>

              {!canRunSimulation && (
                <p className="mt-2 text-sm text-gray-500">
                  Select a firm and account size to run simulation
                </p>
              )}

              <div className="mt-3 text-xs text-gray-500">
                <div>Paths: {simulationSettings.n_paths.toLocaleString()}</div>
                <div>Max trades per path: {simulationSettings.n_trades_per_path}</div>
                <div>Estimated time: ~2-3 seconds</div>
              </div>
            </div>
          </div>

          {/* Main Content - Results */}
          <div className="lg:col-span-3">
            {isSimulating && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-trading-blue mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Running Monte Carlo Simulation
                  </h3>
                  <p className="text-gray-600">
                    Simulating {simulationSettings.n_paths.toLocaleString()} trading paths...
                  </p>
                </div>
              </div>
            )}

            {!isSimulating && !simulationResults && (
              <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Simulate
                </h3>
                <p className="text-gray-600">
                  Configure your strategy parameters and select a firm to run the Monte Carlo simulation.
                </p>
              </div>
            )}

            {simulationResults && selectedAccountData && selectedPlanData && (
              <SimulationResults 
                results={simulationResults}
                account={selectedAccountData}
                firmPlan={selectedPlanData}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
