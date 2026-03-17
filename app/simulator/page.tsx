'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { monteCarloEngine } from '@/lib/simulation';
import { getFirmById, getPlanById, getAccountSize } from '@/lib/firms';
import Layout from '@/components/Layout';
import FirmSelector from '@/components/FirmSelector';
import StrategyInputs from '@/components/StrategyInputs';
import SimulationResultsDisplay from '@/components/SimulationResults';
import { Play, Loader2, AlertCircle } from 'lucide-react';

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
  
  const [error, setError] = useState<string | null>(null);
  
  const selectedFirmData = selectedFirm ? getFirmById(selectedFirm) : null;
  const selectedPlanData = selectedFirm && selectedPlan ? 
    getPlanById(selectedFirm, selectedPlan) : null;
  const selectedAccountData = selectedFirm && selectedPlan && selectedAccountSize ? 
    getAccountSize(selectedFirm, selectedPlan, selectedAccountSize) : null;
  
  const canRunSimulation = selectedFirmData && selectedPlanData && selectedAccountData;
  
  const runSimulation = async () => {
    if (!canRunSimulation) return;
    
    setError(null);
    setIsSimulating(true);
    setSimulationResults(null);
    
    try {
      // Run simulation in a setTimeout to allow UI to update
      setTimeout(() => {
        try {
          const results = monteCarloEngine.simulate(
            strategy,
            selectedAccountData,
            selectedPlanData,
            simulationSettings
          );
          
          setSimulationResults(results);
          setIsSimulating(false);
        } catch (simulationError) {
          console.error('Simulation error:', simulationError);
          setError('Simulation failed. Please check your parameters and try again.');
          setIsSimulating(false);
        }
      }, 100);
    } catch (error) {
      console.error('Setup error:', error);
      setError('Failed to start simulation. Please refresh and try again.');
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
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="text-blue-600 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium">How to use this simulator:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Select your target prop firm and account size</li>
                  <li>Configure your trading strategy parameters</li>
                  <li>Run the Monte Carlo simulation to see probability of success</li>
                  <li>Analyze expected payouts and monthly income projections</li>
                </ol>
              </div>
            </div>
          </div>
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
                className={`w-full flex items-center justify-center px-4 py-3 font-medium rounded-lg transition-colors ${
                  canRunSimulation && !isSimulating
                    ? 'bg-trading-blue text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
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
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-800 font-medium">Simulation Error</p>
                </div>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            )}
            
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
                  <div className="mt-4 w-64 bg-gray-200 rounded-full h-2 mx-auto">
                    <div className="bg-trading-blue h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {!isSimulating && !simulationResults && !error && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <Play className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  Ready to Simulate
                </h3>
                <p className="text-gray-600 mb-6">
                  Configure your strategy parameters and select a firm to run the Monte Carlo simulation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-gray-900 mb-2">📊 Comprehensive Analysis</h4>
                    <p className="text-gray-600">Pass rates, expected payouts, risk metrics</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-gray-900 mb-2">📈 Professional Charts</h4>
                    <p className="text-gray-600">Equity curves, distributions, percentiles</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-gray-900 mb-2">💰 Financial Projections</h4>
                    <p className="text-gray-600">Monthly income, fees, reset costs</p>
                  </div>
                </div>
              </div>
            )}
            
            {simulationResults && selectedAccountData && selectedPlanData && (
              <SimulationResultsDisplay 
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