import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { useTransactionStore } from '../store/transactionStore';
import { useProfileStore } from '../store/profileStore';
import { Icon } from '../components/ui/Icon';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableSection({ id, children }: { id: string, children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as const,
  };
  return (
    <div ref={setNodeRef} style={style} className="group/section relative mb-6">
      <div 
        className="absolute -left-6 top-1/2 -translate-y-1/2 p-1 cursor-grab active:cursor-grabbing text-surface-container hover:text-on-surface-variant transition-colors z-20 hidden md:block opacity-0 group-hover/section:opacity-100" 
        {...attributes} 
        {...listeners}
      >
        <Icon name="drag_indicator" />
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}

export const Dashboard: React.FC = () => {
  const { transactions, loading, fetchTransactions } = useTransactionStore();
  const { profile, updateProfile } = useProfileStore();
  const currency = profile?.currency || '₱';

  const [layout, setLayout] = useState<string[]>(['overview', 'charts', 'transactions']);
  const [timeframe, setTimeframe] = useState<number>(6);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    if (profile?.dashboard_layout && Array.isArray(profile.dashboard_layout) && profile.dashboard_layout.length > 0) {
      setLayout(profile.dashboard_layout);
    }
  }, [profile?.dashboard_layout]);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = layout.indexOf(active.id as string);
      const newIndex = layout.indexOf(over.id as string);
      const newLayout = arrayMove(layout, oldIndex, newIndex);
      setLayout(newLayout);
      await updateProfile({ dashboard_layout: newLayout });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const { totalIncome, totalExpense, balance, chartData, categoryData } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const categories: Record<string, number> = {};
    const now = new Date();
    const chartMonths = Array.from({ length: timeframe }, (_, i) => {
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
      const mData = chartMonths.find(m => m.monthIndex === txDate.getMonth() && m.year === txDate.getFullYear());
      if (mData) {
        if (tx.type === 'income') mData.income += tx.amount;
        else mData.expense += tx.amount;
      }
    });

    return {
      totalIncome: inc,
      totalExpense: exp,
      balance: inc - exp,
      chartData: chartMonths,
      categoryData: Object.entries(categories).map(([name, value]) => ({ name, value }))
    };
  }, [transactions, timeframe]);

  const CHART_COLORS = ['var(--primary)', 'var(--tertiary)', 'var(--surface-container-highest)', 'var(--error)'];

  const sections: Record<string, React.ReactNode> = {
    overview: (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-container rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 z-10">
            <Icon name="account_balance_wallet" className="text-primary" />
            Total Balance
          </h3>
          <div className="font-display-lg text-4xl sm:text-5xl font-data-mono text-primary z-10 tracking-tight">
            {loading ? <Skeleton className="h-10 w-32 mt-2" /> : <>{balance < 0 ? '-' : ''}{currency}{Math.abs(balance).toFixed(2)}</>}
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-32">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
            <Icon name="arrow_upward" className="text-tertiary" />
            Total Income
          </h3>
          <div className="font-headline-lg text-3xl sm:text-4xl font-data-mono text-on-surface">
            {loading ? <Skeleton className="h-8 w-28 mt-2" /> : <>{currency}{totalIncome.toFixed(2)}</>}
          </div>
        </Card>

        <Card className="flex flex-col justify-between h-32">
          <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
            <Icon name="arrow_downward" className="text-error" />
            Total Expenses
          </h3>
          <div className="font-headline-lg text-3xl sm:text-4xl font-data-mono text-on-surface">
            {loading ? <Skeleton className="h-8 w-28 mt-2" /> : <>{currency}{totalExpense.toFixed(2)}</>}
          </div>
        </Card>
      </section>
    ),
    charts: (
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 min-h-[320px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Income vs Expenses</h3>
            <select 
              value={timeframe} 
              onChange={e => setTimeframe(Number(e.target.value))}
              className="bg-surface-container-low text-on-surface border-none rounded-lg px-3 py-1 font-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={3}>Last 3 Months</option>
              <option value={6}>Last 6 Months</option>
              <option value={12}>Last 12 Months</option>
            </select>
          </div>
          <div className="flex-1 min-h-[250px]">
            {loading ? (
              <div className="w-full h-full flex items-end gap-2 pb-4">
                {[...Array(timeframe)].map((_, i) => (
                  <Skeleton key={i} className="flex-1 h-3/4 rounded-t-md" style={{ height: `${Math.random() * 60 + 20}%` }} />
                ))}
              </div>
            ) : (
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
            )}
          </div>
        </Card>

        <div className="xl:col-span-1 flex flex-col gap-6">
          <Card className="flex flex-col flex-1">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Category Breakdown</h3>
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Skeleton className="w-48 h-48 rounded-full" />
              </div>
            ) : categoryData.length > 0 ? (
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
    ),
    transactions: (
      <section>
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
                <>
                  {[...Array(3)].map((_, i) => (
                    <tr key={i} className="border-b border-surface-container-lowest last:border-0">
                      <td colSpan={4} className="py-3"><Skeleton className="h-8 w-full" /></td>
                    </tr>
                  ))}
                </>
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
    )
  };

  return (
    <div className="space-y-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Overview</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Here's your fiscal health at a glance.</p>
        </div>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={layout} strategy={verticalListSortingStrategy}>
          {layout.map((id) => (
            <SortableSection key={id} id={id}>
              {sections[id]}
            </SortableSection>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
