'use client';

import { memo } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Users, Calendar } from 'lucide-react';

interface UserGrowthChartProps {
  data: { date: string; users: number }[];
}

export const UserGrowthChart = memo(({ data }: UserGrowthChartProps) => {
  const chartData = data.map((item, index) => {
    // Cycle through colors - using a different palette for users
    const colors = [
      'bg-indigo-500', 'bg-pink-500', 'bg-rose-500', 
      'bg-orange-500', 'bg-amber-500', 'bg-teal-500', 'bg-cyan-500'
    ];
    
    return {
      date: item.date,
      value: item.users,
      color: colors[index % colors.length]
    };
  });

  const totalNewUsers = data.reduce((acc, curr) => acc + curr.users, 0);
  
  return (
    <div className="border-border bg-card/40 rounded-xl border p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Users className="h-5 w-5 text-indigo-500" />
            User Growth
          </h3>
          <p className="text-muted-foreground text-sm">
            Daily user registration
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Last 7 days
        </Button>
      </div>

      {/* Fixed Chart Area */}
      <div className="relative mb-4 h-64 rounded-lg p-4">
        <div className="flex h-full items-end justify-between gap-3">
          {chartData.map((item, index) => (
            <div
              key={item.date}
              className="group flex flex-1 flex-col items-center"
            >
              <motion.div
                initial={{ height: 0 }}
                // Scale height based on max value
                 animate={{ height: `${item.value > 0 ? (item.value / (Math.max(...chartData.map(d => d.value)) || 1)) * 180 : 4}px` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`w-full ${item.color} relative min-h-1 cursor-pointer rounded-t-lg transition-opacity hover:opacity-80`}
              >
                {/* Tooltip */}
                <div className="border-border bg-popover absolute -top-10 left-1/2 z-10 -translate-x-1/2 transform rounded-lg border px-3 py-2 text-sm whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  <div className="font-medium">
                    {item.value} Users
                  </div>
                </div>
              </motion.div>
              <div className="text-muted-foreground mt-2 text-center text-xs font-medium">
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="border-border/50 grid grid-cols-1 gap-4 border-t pt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-500">{totalNewUsers}</div>
          <div className="text-muted-foreground text-xs">Total New Users</div>
        </div>
      </div>
    </div>
  );
});

UserGrowthChart.displayName = "UserGrowthChart";
