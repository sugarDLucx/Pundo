import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ProgressBar } from '../components/ui/ProgressBar';
import { GoalForm } from '../components/goals/GoalForm';
import { AddFundsForm } from '../components/goals/AddFundsForm';
import { useGoalStore } from '../store/goalStore';
import { Plus, Target, Trash2 } from 'lucide-react';

export const Goals: React.FC = () => {
  const { goals, loading, fetchGoals, deleteGoal } = useGoalStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [fundingGoalId, setFundingGoalId] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Financial Goals</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Track and fund your savings targets.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Goal
        </Button>
      </div>

      {loading && goals.length === 0 ? (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading goals...</div>
      ) : goals.length === 0 ? (
        <Card className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No active goals</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6">Create a goal to start tracking your savings progress.</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>Create Your First Goal</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = Math.min(100, Math.max(0, (goal.current_amount / goal.target_amount) * 100));
            const isCompleted = progress >= 100;

            return (
              <Card key={goal.id} className="flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="pr-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{goal.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Target: {goal.target_date}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-slate-400 hover:text-danger transition-colors p-1"
                    title="Delete Goal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      ₱{goal.current_amount.toFixed(2)}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      of ₱{goal.target_amount.toFixed(2)}
                    </span>
                  </div>
                  <ProgressBar value={progress} variant={isCompleted ? "success" : "primary"} />
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-[#20201F]">
                  <Button 
                    variant={isCompleted ? 'ghost' : 'secondary'} 
                    className="w-full"
                    onClick={() => setFundingGoalId(goal.id)}
                    disabled={isCompleted}
                  >
                    {isCompleted ? 'Goal Reached! 🎉' : 'Add Funds'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Financial Goal"
      >
        <GoalForm
          onSuccess={() => setIsCreateModalOpen(false)}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Add Funds Modal */}
      <Modal
        isOpen={!!fundingGoalId}
        onClose={() => setFundingGoalId(null)}
        title="Fund Your Goal"
      >
        {fundingGoalId && (
          <AddFundsForm
            goalId={fundingGoalId}
            onSuccess={() => setFundingGoalId(null)}
            onCancel={() => setFundingGoalId(null)}
          />
        )}
      </Modal>
    </div>
  );
};
