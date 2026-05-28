import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Icon } from '../components/ui/Icon';
import { GoalForm } from '../components/goals/GoalForm';
import { AddFundsForm } from '../components/goals/AddFundsForm';
import { useGoalStore } from '../store/goalStore';
import { useProfileStore } from '../store/profileStore';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../lib/utils';
import { format, differenceInMonths, differenceInDays } from 'date-fns';

export const Goals: React.FC = () => {
  const { goals, loading, fetchGoals, deleteGoal } = useGoalStore();
  const { profile } = useProfileStore();
  const currency = profile?.currency || '₱';
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [addFundsTarget, setAddFundsTarget] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(id);
    }
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'text-tertiary';
    if (percentage >= 50) return 'text-primary';
    return 'text-on-surface-variant';
  };

  const totalSaved = goals.reduce((acc, goal) => acc + goal.current_amount, 0);
  const activeGoalsCount = goals.length;
  
  let onTrackCount = 0;
  let needsAttentionCount = 0;

  goals.forEach(goal => {
    const percentage = (goal.current_amount / goal.target_amount) * 100;
    if (percentage >= 100) {
      onTrackCount++;
      return;
    }
    
    // Calculate elapsed time vs target time
    const startDate = goal.created_at ? new Date(goal.created_at) : new Date(); // fallback to now if missing
    const targetDate = new Date(goal.target_date);
    const currentDate = new Date();
    
    const totalDays = differenceInDays(targetDate, startDate) || 1;
    const elapsedDays = differenceInDays(currentDate, startDate);
    const timePercentage = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

    if (percentage >= timePercentage) {
      onTrackCount++;
    } else {
      needsAttentionCount++;
    }
  });

  return (
    <div className="space-y-6">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Financial Goals</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Track and manage your savings targets.</p>
        </div>
        <Button variant="primary" onClick={() => setIsGoalModalOpen(true)} className="flex items-center gap-2 rounded-full px-6 py-2">
          <Icon name="add" className="text-[20px]" />
          Create Goal
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="flex flex-col justify-center">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Total Saved Towards Goals</h3>
          <div className="font-headline-lg text-4xl sm:text-5xl font-data-mono text-on-surface mb-2">
            {currency}{totalSaved.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
        </Card>
        <Card className="flex flex-col justify-center">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">Active Goals</h3>
          <div className="font-headline-lg text-4xl sm:text-5xl font-data-mono text-on-surface mb-3">
            {activeGoalsCount}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full font-label-sm">On Track: {onTrackCount}</span>
            <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-label-sm">Needs Attention: {needsAttentionCount}</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading && goals.length === 0 ? (
          <>
            <Card><Skeleton className="h-40 w-full" /></Card>
            <Card><Skeleton className="h-40 w-full" /></Card>
          </>
        ) : goals.length === 0 ? (
          <div className="col-span-full py-12 text-center text-on-surface-variant font-label-md">
            No goals found. Create one to start saving!
          </div>
        ) : (
          goals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
            const isCompleted = percentage >= 100;
            const progressColorText = getProgressColor(goal.current_amount, goal.target_amount);
            
            const targetDate = new Date(goal.target_date);
            const monthsRemaining = Math.max(1, differenceInMonths(targetDate, new Date()));
            const amountNeeded = Math.max(0, goal.target_amount - goal.current_amount);
            const monthlyAmount = amountNeeded / monthsRemaining;

            return (
              <Card key={goal.id} className="flex flex-col gap-6 relative">
                {isCompleted && (
                  <div className="absolute -top-3 -right-3 bg-tertiary text-on-tertiary rounded-full p-2 shadow-lg">
                    <Icon name="emoji_events" className="text-[20px]" />
                  </div>
                )}
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface line-clamp-1" title={goal.name}>
                      {goal.name}
                    </h3>
                    <p className="font-label-md text-label-md text-on-surface-variant mt-1">
                      Target Date: {goal.target_date}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-on-surface-variant hover:text-error transition-colors p-2 -mr-2 -mt-2 rounded-full hover:bg-error-container/30"
                    title="Delete Goal"
                  >
                    <Icon name="delete" className="text-[18px]" />
                  </button>
                </div>

                <div className="flex flex-col gap-2 flex-1 justify-center">
                  <div className="flex justify-between items-end">
                    <span className="font-data-mono text-data-mono font-bold text-on-surface">
                      {currency}{goal.current_amount.toFixed(2)} / {currency}{goal.target_amount.toFixed(2)}
                    </span>
                    <span className={cn("font-label-md text-label-md", progressColorText)}>
                      {percentage}%
                    </span>
                  </div>
                  <ProgressBar 
                    value={percentage} 
                    variant={isCompleted ? 'success' : 'primary'} 
                  />
                </div>

                <div className="flex justify-between items-center mt-2 pt-4 border-t border-surface-container-low">
                  <div className="flex items-center gap-2 text-on-surface-variant font-label-md">
                    <Icon name="calendar_today" className="text-[16px]" />
                    {format(targetDate, 'MMM yyyy')}
                  </div>
                  {!isCompleted && (
                    <div className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-label-sm font-data-mono">
                      +{currency}{monthlyAmount.toFixed(0)}/mo
                    </div>
                  )}
                </div>

                <Button
                  variant="secondary"
                  className="w-full mt-auto rounded-full font-label-md"
                  onClick={() => setAddFundsTarget(goal.id)}
                  disabled={isCompleted}
                >
                  {isCompleted ? 'Goal Completed' : 'Add Funds'}
                </Button>
              </Card>
            );
          })
        )}
      </div>

      <Modal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        title="Create New Goal"
      >
        <GoalForm onSuccess={() => setIsGoalModalOpen(false)} onCancel={() => setIsGoalModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={!!addFundsTarget}
        onClose={() => setAddFundsTarget(null)}
        title="Add Funds to Goal"
      >
        {addFundsTarget && (
          <AddFundsForm 
            goalId={addFundsTarget} 
            onSuccess={() => setAddFundsTarget(null)} 
            onCancel={() => setAddFundsTarget(null)}
          />
        )}
      </Modal>
    </div>
  );
};
