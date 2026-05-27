import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useGoalStore } from '../../store/goalStore';

interface AddFundsFormProps {
  goalId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddFundsForm: React.FC<AddFundsFormProps> = ({ goalId, onSuccess, onCancel }) => {
  const addFunds = useGoalStore((state) => state.addFunds);
  
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await addFunds(goalId, Number(amount));
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Amount to Add"
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        required
      />
      <p className="text-xs text-slate-500 dark:text-slate-400">
        This will automatically create a "Savings" expense in your transactions list.
      </p>

      {error && <div className="text-sm text-danger">{error}</div>}

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Funds'}
        </Button>
      </div>
    </form>
  );
};
