import React, { useEffect, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { useTransactionStore } from '../store/transactionStore';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { transactions, loading, fetchTransactions } = useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Calculate totals
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, tx) => {
        if (tx.type === 'income') {
          acc.totalIncome += tx.amount;
          acc.balance += tx.amount;
        } else {
          acc.totalExpense += tx.amount;
          acc.balance -= tx.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, balance: 0 }
    );
  }, [transactions]);

  // Generate chart data (group expenses by day of the week for the last 7 days)
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = days.map((day) => ({ name: day, amount: 0 }));
    
    // Simple grouping: just find the day of the week for each transaction
    transactions.forEach((tx) => {
      if (tx.type === 'expense') {
        const date = new Date(tx.date);
        const dayName = days[date.getDay()];
        const target = data.find((d) => d.name === dayName);
        if (target) {
          target.amount += tx.amount;
        }
      }
    });
    
    return data;
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your financial overview.</p>
        </div>
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card>
          <div className="flex items-center text-slate-500 dark:text-slate-400 mb-2">
            <Wallet className="h-5 w-5 mr-2 text-primary" />
            <span className="text-sm font-medium">Total Balance</span>
          </div>
          <div className="text-3xl font-bold font-mono dark:text-white">
            {balance < 0 ? '-' : ''}₱{Math.abs(balance).toFixed(2)}
          </div>
        </Card>
        <Card>
          <div className="flex items-center text-slate-500 dark:text-slate-400 mb-2">
            <ArrowDownRight className="h-5 w-5 mr-2 text-emerald-500" />
            <span className="text-sm font-medium">Total Income</span>
          </div>
          <div className="text-3xl font-bold font-mono dark:text-white">₱{totalIncome.toFixed(2)}</div>
        </Card>
        <Card>
          <div className="flex items-center text-slate-500 dark:text-slate-400 mb-2">
            <ArrowUpRight className="h-5 w-5 mr-2 text-rose-500" />
            <span className="text-sm font-medium">Total Expenses</span>
          </div>
          <div className="text-3xl font-bold font-mono dark:text-white">₱{totalExpense.toFixed(2)}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <Card className="lg:col-span-2 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Expenses by Day</h2>
          <div className="h-72 w-full flex-1">
            {loading && transactions.length === 0 ? (
              <div className="flex h-full items-center justify-center text-slate-400">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.amount > 0 ? '#00288e' : '#dde1ff'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Recent Transactions Section */}
        <Card className="flex flex-col overflow-hidden">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Transactions</h2>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {loading && transactions.length === 0 ? (
              <div className="text-center text-sm text-slate-400 py-4">Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center text-sm text-slate-400 py-4">No transactions yet</div>
            ) : (
              transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border-b border-slate-100 dark:border-[#20201F] pb-3 last:border-0 last:pb-0">
                  <div className="truncate pr-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{tx.note || '—'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{tx.date} • {tx.category}</p>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <p className={cn("text-sm font-bold font-mono", tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900 dark:text-white')}>
                      {tx.type === 'income' ? '+' : '-'}₱{Math.abs(tx.amount).toFixed(2)}
                    </p>
                    <Badge variant={tx.type === 'income' ? 'success' : 'neutral'} className="mt-1">
                      {tx.type}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link 
            to="/transactions" 
            className="mt-4 block w-full text-center text-sm font-medium text-primary hover:text-primary-hover"
          >
            View All
          </Link>
        </Card>
      </div>
    </div>
  );
};
