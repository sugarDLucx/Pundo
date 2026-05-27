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
      if (tx.type === 'income') {
        inc += tx.amount;
      } else {
        exp += tx.amount;
        categories[tx.category] = (categories[tx.category] || 0) + tx.amount;
      }

      const txDate = new Date(tx.date);
      const mData = last6Months.find(m => m.monthIndex === txDate.getMonth() && m.year === txDate.getFullYear());
      if (mData) {
        if (tx.type === 'income') mData.income += tx.amount;
        else mData.expense += tx.amount;
      }
    });

    return {
      totalIncome: inc,
      totalExpense: exp,
      balance: inc - exp,
      chartData: last6Months,
      categoryData: Object.entries(categories).map(([name, value]) => ({ name, value }))
    };
  }, [transactions]);

  // Use CSS variables for charts
  const CHART_COLORS = ['var(--primary)', 'var(--tertiary)', 'var(--surface-container-highest)', 'var(--error)'];

  return (
    <div className="space-y-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Overview</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Here's your fiscal health at a glance.</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-container rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 z-10">
            <Icon name="account_balance_wallet" className="text-primary" />
            Total Balance
          </h3>
          <div className="font-display-lg text-4xl sm:text-5xl font-data-mono text-primary z-10 tracking-tight">
            {balance < 0 ? '-' : ''}₱{Math.abs(balance).toFixed(2)}
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
              <Icon name="arrow_upward" className="text-tertiary" />
              Total Income
            </h3>
          </div>
          <div className="font-headline-lg text-3xl sm:text-4xl font-data-mono text-on-surface">
            ₱{totalIncome.toFixed(2)}
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
              <Icon name="arrow_downward" className="text-error" />
              Total Expenses
            </h3>
          </div>
          <div className="font-headline-lg text-3xl sm:text-4xl font-data-mono text-on-surface">
            ₱{totalExpense.toFixed(2)}
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Card className="xl:col-span-2 min-h-[320px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Income vs Expenses</h3>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="font-label-md text-label-md text-on-surface-variant">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-surface-container-highest"></span>
                <span className="font-label-md text-label-md text-on-surface-variant">Expenses</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--on-surface-variant)', fontSize: 12, fontFamily: 'Inter' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--on-surface-variant)', fontSize: 12, fontFamily: 'JetBrains Mono' }} tickFormatter={(val) => `₱${val}`} />
                <Tooltip 
                  cursor={{ fill: 'var(--surface-container-low)' }}
                  contentStyle={{ backgroundColor: 'var(--inverse-surface)', border: 'none', borderRadius: '8px', color: 'var(--inverse-on-surface)' }}
                  itemStyle={{ fontFamily: 'JetBrains Mono' }}
                />
                <Bar dataKey="income" fill="var(--primary)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="expense" fill="var(--surface-container-highest)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="xl:col-span-1 flex flex-col gap-6">
          <Card className="flex flex-col flex-1">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Category Breakdown</h3>
            {categoryData.length > 0 ? (
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--inverse-surface)', border: 'none', borderRadius: '8px', color: 'var(--inverse-on-surface)' }}
                      itemStyle={{ fontFamily: 'JetBrains Mono' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-on-surface-variant font-label-md">
                No expense data
              </div>
            )}
          </Card>
        </div>
      </section>

      <section className="mb-6">
        <Card className="overflow-x-auto">
          <div className="flex justify-between items-center mb-4 min-w-[600px]">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Transactions</h3>
          </div>
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-surface-container-low text-on-surface-variant font-label-md text-label-md">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface">
              {loading && transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-on-surface-variant py-4">Loading...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-on-surface-variant py-4">No transactions yet</td>
                </tr>
              ) : (
                transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="border-b border-surface-container-lowest hover:bg-surface-container-low transition-colors group cursor-pointer last:border-0">
                    <td className="py-4">{tx.date}</td>
                    <td className="py-4 font-medium group-hover:text-primary transition-colors">{tx.note || '—'}</td>
                    <td className="py-4">
                      <span className="inline-block px-2 py-1 bg-surface-container-high text-on-surface-variant font-label-md text-[10px] rounded uppercase tracking-wider">
                        {tx.category}
                      </span>
                    </td>
                    <td className={cn("py-4 text-right font-data-mono font-medium", tx.type === 'income' ? 'text-tertiary' : 'text-on-surface')}>
                      {tx.type === 'income' ? '+' : '-'}₱{Math.abs(tx.amount).toFixed(2)}
        </Card>
      </div>
    </div>
  );
};
