import { useState } from 'react';
import { PROP_FIRMS, getFirmById, getPlanById } from '@/lib/firms';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export default function FirmSelector() {
  const {
    selectedFirm,
    selectedPlan,
    selectedAccountSize,
    setFirmSelection
  } = useAppStore();

  const [firmDropdownOpen, setFirmDropdownOpen] = useState(false);
  const [planDropdownOpen, setPlanDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const selectedFirmData = selectedFirm ? getFirmById(selectedFirm) : null;
  const selectedPlanData = selectedFirm && selectedPlan ? 
    getPlanById(selectedFirm, selectedPlan) : null;
  const selectedAccountData = selectedPlanData?.account_sizes.find(
    a => a.size === selectedAccountSize
  );

  const handleFirmChange = (firmId: string) => {
    const firm = getFirmById(firmId);
    if (firm && firm.plans.length > 0) {
      const firstPlan = firm.plans[0];
      const firstAccount = firstPlan.account_sizes[0];
      setFirmSelection(firmId, firstPlan.id, firstAccount.size);
    }
    setFirmDropdownOpen(false);
  };

  const handlePlanChange = (planId: string) => {
    if (!selectedFirm) return;
    const plan = getPlanById(selectedFirm, planId);
    if (plan && plan.account_sizes.length > 0) {
      const firstAccount = plan.account_sizes[0];
      setFirmSelection(selectedFirm, planId, firstAccount.size);
    }
    setPlanDropdownOpen(false);
  };

  const handleAccountChange = (size: number) => {
    if (selectedFirm && selectedPlan) {
      setFirmSelection(selectedFirm, selectedPlan, size);
    }
    setAccountDropdownOpen(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Firm Selection</h3>

      {/* Firm Dropdown */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prop Firm
        </label>
        <button
          onClick={() => setFirmDropdownOpen(!firmDropdownOpen)}
          className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-trading-blue focus:border-trading-blue"
        >
          <span className="text-sm">
            {selectedFirmData?.name || 'Select a firm...'}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {firmDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            {PROP_FIRMS.map((firm) => (
              <button
                key={firm.id}
                onClick={() => handleFirmChange(firm.id)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
              >
                {firm.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Plan Dropdown */}
      {selectedFirmData && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan Type
          </label>
          <button
            onClick={() => setPlanDropdownOpen(!planDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-trading-blue focus:border-trading-blue"
          >
            <span className="text-sm">
              {selectedPlanData?.name || 'Select a plan...'}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {planDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              {selectedFirmData.plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handlePlanChange(plan.id)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                >
                  {plan.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Account Size Dropdown */}
      {selectedPlanData && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Size
          </label>
          <button
            onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-trading-blue focus:border-trading-blue"
          >
            <span className="text-sm">
              {selectedAccountSize ? formatCurrency(selectedAccountSize) : 'Select account size...'}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {accountDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
              {selectedPlanData.account_sizes.map((account) => (
                <button
                  key={account.size}
                  onClick={() => handleAccountChange(account.size)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                >
                  {formatCurrency(account.size)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Account Details */}
      {selectedAccountData && selectedPlanData && (
        <div className="bg-gray-50 rounded-lg p-4 mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Account Rules</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Profit Target:</span>
              <span className="ml-2 font-medium">{formatCurrency(selectedAccountData.profit_target)}</span>
            </div>
            <div>
              <span className="text-gray-600">Trailing DD:</span>
              <span className="ml-2 font-medium">{formatCurrency(selectedAccountData.trailing_drawdown)}</span>
            </div>
            <div>
              <span className="text-gray-600">DD Type:</span>
              <span className="ml-2 font-medium capitalize">{selectedPlanData.drawdown_type.replace('_', ' ')}</span>
            </div>
            {selectedAccountData.daily_loss_limit && (
              <div>
                <span className="text-gray-600">DLL:</span>
                <span className="ml-2 font-medium">{formatCurrency(selectedAccountData.daily_loss_limit)}</span>
              </div>
            )}
            <div>
              <span className="text-gray-600">Max Contracts:</span>
              <span className="ml-2 font-medium">{selectedAccountData.max_contracts}</span>
            </div>
            <div>
              <span className="text-gray-600">Payout Split:</span>
              <span className="ml-2 font-medium">{(selectedPlanData.payout_split * 100).toFixed(0)}%</span>
            </div>
          </div>

          {selectedAccountData.eval_fee && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Eval Fee:</span>
                <span className="font-medium">{formatCurrency(selectedAccountData.eval_fee)}</span>
              </div>
              {selectedPlanData.monthly_fee && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Monthly Fee:</span>
                  <span className="font-medium">{formatCurrency(selectedPlanData.monthly_fee)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
