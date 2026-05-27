import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Icon } from '../components/ui/Icon';
import { GoalForm } from '../components/goals/GoalForm';
import { AddFundsForm } from '../components/goals/AddFundsForm';
import { useGoalStore } from '../store/goalStore';
import { ProgressBar } from '../components/ui/ProgressBar';
import { cn } from '../lib/utils';

export const Goals: React.FC = () => {
  const { goals, loading, fetchGoals, deleteGoal } = useGoalStore();
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading && goals.length === 0 ? (
          <div className="col-span-full py-12 text-center text-on-surface-variant font-label-md">
            Loading goals...
          </div>
        ) : goals.length === 0 ? (
          <div className="col-span-full py-12 text-center text-on-surface-variant font-label-md">
            No goals found. Create one to start saving!
          </div>
        ) : (
          goals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
            const isCompleted = percentage >= 100;
            const progressColorText = getProgressColor(goal.current_amount, goal.target_amount);

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
                      ₱{goal.current_amount.toFixed(2)} / ₱{goal.target_amount.toFixed(2)}
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
