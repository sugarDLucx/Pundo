import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { useTransactionStore } from '../store/transactionStore';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const Transactions: React.FC = () => {
  const { transactions, loading, fetchTransactions, deleteTransaction } = useTransactionStore();
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Transactions</h1>
          <p className="mt-1 text-slate-500">View and manage your financial records.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <Card className="overflow-hidden p-0 sm:p-0">
        <div className="overflow-x-auto">
          {loading && transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No transactions found. Add one to get started!</div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4">{tx.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{tx.note || '—'}</td>
                    <td className="px-6 py-4">{tx.category}</td>
                    <td className="px-6 py-4">
                      <Badge variant={tx.type === 'income' ? 'success' : 'neutral'}>
                        {tx.type}
                      </Badge>
                    </td>
                    <td className={cn("px-6 py-4 text-right font-mono font-bold", tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900')}>
                      {tx.type === 'income' ? '+' : '-'}₱{tx.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="text-slate-400 hover:text-danger transition-colors"
                        title="Delete Transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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
