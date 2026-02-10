"use client";

import { memo } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar } from "lucide-react";

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

export const RevenueChart = memo(({ data }: RevenueChartProps) => {
  const chartData = data?.map((item, index) => {
    const prevRevenue = index > 0 ? data[index - 1].revenue : 0;
    const growth =
      prevRevenue > 0 ? ((item.revenue - prevRevenue) / prevRevenue) * 100 : 0;

    // Cycle through colors
    const colors = [
      "bg-blue-500",
      "bg-red-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-cyan-500",
    ];

    return {
      month: item.month,
      value: item.revenue,
      growth: Math.round(growth),
      color: colors[index % colors?.length],
    };
  });

  const totalRevenue = data?.reduce((acc, curr) => acc + curr.revenue, 0);
  // Calculate average growth or just show something meaningful
  const averageRevenue = totalRevenue / (data?.length || 1);
  const growthRate =
    chartData.length > 0 ? chartData[chartData?.length - 1].growth : 0;

  return (
    <div className="border-border bg-card/40 rounded-xl border p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <BarChart3 className="h-5 w-5 text-green-500" />
            Revenue Analytics
          </h3>
          <p className="text-muted-foreground text-sm">
            Monthly revenue performance
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Last {data?.length} months
        </Button>
      </div>

      {/* Fixed Chart Area */}
      <div className="relative mb-4 h-64 rounded-lg p-4">
        <div className="flex h-full items-end justify-between gap-3">
          {chartData?.map((item, index) => (
            <div
              key={item.month}
              className="group flex flex-1 flex-col items-center"
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{
                  height: `${item.value > 0 ? (item.value / (Math.max(...chartData?.map((d) => d.value)) || 1)) * 180 : 4}px`,
                }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className={`w-full ${item.color} relative min-h-1 cursor-pointer rounded-t-lg transition-opacity hover:opacity-80`}
              >
                <div className="border-border bg-popover absolute -top-16 left-1/2 z-10 -translate-x-1/2 transform rounded-lg border px-3 py-2 text-sm whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  <div className="font-medium">
                    ${item.value.toLocaleString()}
                  </div>
                  <div
                    className={`text-xs ${item.growth >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {item.growth > 0 ? "+" : ""}
                    {item.growth}%
                  </div>
                </div>
              </motion.div>
              <div className="text-muted-foreground mt-2 text-center text-xs font-medium">
                {item.month}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="border-border/50 grid grid-cols-3 gap-4 border-t pt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-muted-foreground text-xs">Total Revenue</div>
        </div>
        <div className="text-center">
          <div
            className={`text-2xl font-bold ${growthRate >= 0 ? "text-blue-500" : "text-red-500"}`}
          >
            {growthRate > 0 ? "+" : ""}
            {growthRate}%
          </div>
          <div className="text-muted-foreground text-xs">Growth Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-500">
            ${Math.round(averageRevenue).toLocaleString()}
          </div>
          <div className="text-muted-foreground text-xs">Average</div>
        </div>
      </div>
    </div>
  );
});

RevenueChart.displayName = "RevenueChart";
