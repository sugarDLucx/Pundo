import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Icon } from '../components/ui/Icon';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { useTransactionStore } from '../store/transactionStore';
import { useProfileStore } from '../store/profileStore';
import { cn } from '../lib/utils';

export const Transactions: React.FC = () => {
  const { transactions, loading, fetchTransactions, deleteTransaction } = useTransactionStore();
  const { profile } = useProfileStore();
  const currency = profile?.currency || '₱';
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Transactions</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Review your financial activity.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-full px-6 py-2">
          <Icon name="add" className="text-[20px]" />
          Add Transaction
        </Button>
      </header>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="border-b border-surface-container-low text-on-surface-variant font-label-md text-label-md bg-surface-container-lowest">
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Amount</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-body-sm text-body-sm text-on-surface">
            {loading && transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-on-surface-variant py-8">Loading transactions...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-on-surface-variant py-8">No transactions found. Click 'Add Transaction' to start.</td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-surface-container-lowest hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-4">{tx.date}</td>
                  <td className="px-6 py-4 font-medium group-hover:text-primary transition-colors">{tx.note || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-surface-container-high text-on-surface-variant font-label-md text-[10px] rounded uppercase tracking-wider">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-tertiary text-label-md">
                      <Icon name="check_circle" className="text-[14px]" /> Completed
                    </span>
                  </td>
                  <td className={cn("px-6 py-4 text-right font-data-mono font-medium", tx.type === 'income' ? 'text-tertiary' : 'text-on-surface')}>
                    {tx.type === 'income' ? '+' : '-'}{currency}{Math.abs(tx.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="text-on-surface-variant hover:text-error transition-colors p-2 rounded-full hover:bg-error-container/30"
                      title="Delete"
                    >
                      <Icon name="delete" className="text-[18px]" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Transaction"
      >
        <TransactionForm
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
