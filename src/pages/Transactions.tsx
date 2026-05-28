import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Icon } from '../components/ui/Icon';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { Skeleton } from '../components/ui/Skeleton';
import { useTransactionStore } from '../store/transactionStore';
import { useProfileStore } from '../store/profileStore';
import { cn, CATEGORY_THEMES } from '../lib/utils';
import { format, parseISO } from 'date-fns';

export const Transactions: React.FC = () => {
  const { transactions, loading, fetchTransactions, deleteTransaction } = useTransactionStore();
  const { profile } = useProfileStore();
  const currency = profile?.currency || '₱';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState('This Month');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterType, setFilterType] = useState('All Types');

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  // --- Summary Calculations ---
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);

  const currentMonthExpenses = transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear);
  const lastMonthExpenses = transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === lastMonthDate.getMonth() && new Date(t.date).getFullYear() === lastMonthDate.getFullYear());

  const totalSpentThisMonth = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
  const totalSpentLastMonth = lastMonthExpenses.reduce((sum, t) => sum + t.amount, 0);
  let spentPercentageChange = 0;
  if (totalSpentLastMonth > 0) {
    spentPercentageChange = ((totalSpentThisMonth - totalSpentLastMonth) / totalSpentLastMonth) * 100;
  } else if (totalSpentThisMonth > 0) {
    spentPercentageChange = 100;
  }
  const isSpentUp = spentPercentageChange > 0;

  // Top Category
  const categoryTotals = currentMonthExpenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || { amount: 0, count: 0 });
    acc[t.category].amount += t.amount;
    acc[t.category].count += 1;
    return acc;
  }, {} as Record<string, { amount: number, count: number }>);

  let topCategory = '—';
  let topCategoryStats = { amount: 0, count: 0 };
  for (const cat in categoryTotals) {
    if (categoryTotals[cat].amount > topCategoryStats.amount) {
      topCategory = cat;
      topCategoryStats = categoryTotals[cat];
    }
  }

  // Largest Expense
  let largestExpense: any = null;
  if (currentMonthExpenses.length > 0) {
    largestExpense = currentMonthExpenses.reduce((max, t) => t.amount > max.amount ? t : max, currentMonthExpenses[0]);
  }

  // --- Filtering Logic ---
  const uniqueCategories = Array.from(new Set(transactions.map(t => t.category)));
  const filteredTransactions = transactions.filter(t => {
    // Type Filter
    if (filterType !== 'All Types' && filterType.toLowerCase() !== t.type) return false;
    
    // Category Filter
    if (filterCategory !== 'All Categories' && filterCategory !== t.category) return false;
    
    // Month Filter
    if (filterMonth === 'This Month') {
      const d = new Date(t.date);
      if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) return false;
    } else if (filterMonth === 'Last Month') {
      const d = new Date(t.date);
      if (d.getMonth() !== lastMonthDate.getMonth() || d.getFullYear() !== lastMonthDate.getFullYear()) return false;
    } else if (filterMonth === 'Last 3 Months') {
      const d = new Date(t.date);
      const diffMonths = (currentYear - d.getFullYear()) * 12 + (currentMonth - d.getMonth());
      if (diffMonths < 0 || diffMonths > 3) return false;
    }
    
    return true;
  });

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="flex flex-col justify-between h-40">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Spent This Month</h3>
            <div className="bg-primary/20 p-2 rounded-full text-primary">
              <Icon name="account_balance_wallet" className="text-[20px]" />
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-3xl font-data-mono text-on-surface mb-2">
              {currency}{totalSpentThisMonth.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
            <span className={cn("font-label-sm flex items-center gap-1", isSpentUp ? 'text-error' : 'text-primary')}>
              <Icon name={isSpentUp ? 'arrow_upward' : 'arrow_downward'} className="text-[14px]" />
              {Math.abs(spentPercentageChange).toFixed(0)}% from last month
            </span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-40">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Top Category</h3>
            <div className="bg-tertiary/20 p-2 rounded-full text-tertiary">
              <Icon name="restaurant" className="text-[20px]" />
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-3xl font-bold text-on-surface mb-2 truncate">
              {topCategory}
            </div>
            {topCategory !== '—' && (
              <span className="font-label-sm text-on-surface-variant">
                {topCategoryStats.count} transactions ({currency}{topCategoryStats.amount.toFixed(2)})
              </span>
            )}
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-40">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Largest Expense</h3>
            <div className="bg-error-container p-2 rounded-full text-error">
              <Icon name="home" className="text-[20px]" />
            </div>
          </div>
          <div>
            <div className="font-headline-lg text-3xl font-bold text-on-surface mb-2 truncate">
              {largestExpense ? (largestExpense.note || largestExpense.category) : '—'}
            </div>
            {largestExpense && (
              <span className="font-label-sm text-on-surface-variant font-data-mono">
                {format(parseISO(largestExpense.date), 'MMM do')} ({currency}{largestExpense.amount.toFixed(2)})
              </span>
            )}
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <select 
          value={filterMonth} 
          onChange={e => setFilterMonth(e.target.value)}
          className="bg-surface-container-low text-on-surface border-none rounded-lg px-4 py-3 font-label-lg focus:outline-none focus:ring-1 focus:ring-primary appearance-none flex-1 cursor-pointer"
        >
          <option value="This Month">This Month</option>
          <option value="Last Month">Last Month</option>
          <option value="Last 3 Months">Last 3 Months</option>
          <option value="All Time">All Time</option>
        </select>
        
        <select 
          value={filterCategory} 
          onChange={e => setFilterCategory(e.target.value)}
          className="bg-surface-container-low text-on-surface border-none rounded-lg px-4 py-3 font-label-lg focus:outline-none focus:ring-1 focus:ring-primary appearance-none flex-1 cursor-pointer"
        >
          <option value="All Categories">All Categories</option>
          {uniqueCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select 
          value={filterType} 
          onChange={e => setFilterType(e.target.value)}
          className="bg-surface-container-low text-on-surface border-none rounded-lg px-4 py-3 font-label-lg focus:outline-none focus:ring-1 focus:ring-primary appearance-none flex-1 cursor-pointer"
        >
          <option value="All Types">All Types</option>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>
      </div>

      <Card className="overflow-x-auto p-4 md:p-6 bg-surface-container-lowest md:bg-surface">
        {/* Desktop Table View */}
        <div className="hidden md:block">
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
            <tbody className="font-body-md text-body-md text-on-surface">
              {loading && filteredTransactions.length === 0 ? (
                <>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-surface-container-lowest last:border-0">
                      <td colSpan={6} className="py-4"><Skeleton className="h-8 w-full" /></td>
                    </tr>
                  ))}
                </>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-on-surface-variant py-8">No transactions found matching your filters.</td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-surface-container-lowest hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4">{format(parseISO(tx.date), 'MMM do, yyyy')}</td>
                    <td className="px-6 py-4 font-medium group-hover:text-primary transition-colors">{tx.note || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-block px-3 py-1 font-label-md text-[11px] rounded-full uppercase tracking-wider font-bold",
                        CATEGORY_THEMES[tx.category] || CATEGORY_THEMES['Other']
                      )}>
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
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {loading && filteredTransactions.length === 0 ? (
             [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
             ))
          ) : filteredTransactions.length === 0 ? (
             <div className="text-center text-on-surface-variant py-8">No transactions found matching your filters.</div>
          ) : (
             filteredTransactions.map((tx) => (
               <div key={tx.id} className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-low flex flex-col gap-3 shadow-sm">
                 <div className="flex justify-between items-start">
                   <div>
                     <p className="font-medium text-on-surface text-body-lg mb-1 leading-tight">{tx.note || '—'}</p>
                     <p className="font-body-sm text-on-surface-variant">{format(parseISO(tx.date), 'MMM do, yyyy')}</p>
                   </div>
                   <div className={cn("font-data-mono font-medium text-xl", tx.type === 'income' ? 'text-tertiary' : 'text-on-surface')}>
                     {tx.type === 'income' ? '+' : '-'}{currency}{Math.abs(tx.amount).toFixed(2)}
                   </div>
                 </div>
                 
                 <div className="flex justify-between items-center pt-3 border-t border-surface-container-highest">
                   <div className="flex items-center gap-2">
                     <span className={cn(
                        "inline-block px-3 py-1 font-label-md text-[11px] rounded-full uppercase tracking-wider font-bold",
                        CATEGORY_THEMES[tx.category] || CATEGORY_THEMES['Other']
                      )}>
                       {tx.category}
                     </span>
                     <span className="flex items-center gap-1 text-tertiary text-label-sm">
                       <Icon name="check_circle" className="text-[12px]" /> Done
                     </span>
                   </div>
                   <button
                     onClick={() => handleDelete(tx.id)}
                     className="text-on-surface-variant hover:text-error p-1 rounded-full transition-colors"
                     title="Delete"
                   >
                     <Icon name="delete" className="text-[18px]" />
                   </button>
                 </div>
               </div>
             ))
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
