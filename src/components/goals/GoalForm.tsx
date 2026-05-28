import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useGoalStore } from '../../store/goalStore';
import { useNotificationStore } from '../../store/notificationStore';

interface GoalFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onSuccess, onCancel }) => {
  const addGoal = useGoalStore((state) => state.addGoal);
  const addNotification = useNotificationStore((state) => state.addNotification);
  
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || isNaN(Number(targetAmount)) || !targetDate) {
      setError('Please fill in all required fields properly');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await addGoal({
        name,
        target_amount: Number(targetAmount),
        target_date: targetDate,
      });
      
      addNotification('New Goal Created! 🎉', `Good luck saving for ${name}!`, 'success');

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Goal Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. New Car, Emergency Fund"
        required
      />

      <Input
        label="Target Amount"
        type="number"
        step="0.01"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        placeholder="0.00"
        required
      />

      <Input
        label="Target Date"
        type="date"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
        required
      />

      {error && <div className="text-sm text-danger">{error}</div>}

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Create Goal'}
        </Button>
      </div>
    </form>
  );
};
