import React, { useEffect, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { useTransactionStore } from '../store/transactionStore';
import { useProfileStore } from '../store/profileStore';
import { Icon } from '../components/ui/Icon';
import { cn } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const { transactions, loading, fetchTransactions } = useTransactionStore();
  const { profile } = useProfileStore();
  const currency = profile?.currency || '₱';

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const { totalIncome, totalExpense, balance, chartData, categoryData } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const categories: Record<string, number> = {};
    const now = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return {
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        month: d.toLocaleString('default', { month: 'short' }),
        income: 0,
        expense: 0
      };
    }).reverse();

    transactions.forEach((tx) => {
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
            {balance < 0 ? '-' : ''}{currency}{Math.abs(balance).toFixed(2)}
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
            {currency}{totalIncome.toFixed(2)}
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
            {currency}{totalExpense.toFixed(2)}
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Card className="xl:col-span-2 min-h-[320px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Income vs Expenses</h3>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--on-surface-variant)', fontSize: 12, fontFamily: 'Inter' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--on-surface-variant)', fontSize: 12, fontFamily: 'JetBrains Mono' }} tickFormatter={(val) => `${currency}${val}`} />
                <Tooltip 
                  cursor={{ fill: 'var(--surface-container-low)' }}
                  contentStyle={{ backgroundColor: 'var(--inverse-surface)', border: 'none', borderRadius: '8px', color: 'var(--inverse-on-surface)' }}
                  itemStyle={{ fontFamily: 'JetBrains Mono' }}
                  formatter={(val: number) => `${currency}${val.toFixed(2)}`}
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
                      formatter={(val: number) => `${currency}${val.toFixed(2)}`}
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
                      {tx.type === 'income' ? '+' : '-'}{currency}{Math.abs(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
};
