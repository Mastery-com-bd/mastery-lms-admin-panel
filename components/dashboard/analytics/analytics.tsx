"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, MoreVertical } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TextAnimation } from "@/components/ui/text-animation";

const analyticsData = {
  grossRevenue: {
    value: "$2,480.32",
    change: 2.15,
    isPositive: true,
    dateRange: "From Jan 01, 2024 - March 30, 2024",
  },
  avgOrderValue: {
    value: "$56.12",
    change: 2.15,
    isPositive: false,
    dateRange: "From Jan 01, 2024 - March 30, 2024",
  },
  totalOrders: {
    value: "$230",
    change: 2.15,
    isPositive: true,
    dateRange: "From Jan 01, 2024 - March 30, 2024",
  },
};

const transactionData = [
  { name: "Jan", total: 350, success: 400 },
  { name: "Feb", total: 450, success: 380 },
  { name: "Mar", total: 380, success: 480 },
  { name: "Apr", total: 450, success: 350 },
  { name: "May", total: 520, success: 450 },
  { name: "Jun", total: 480, success: 580 },
  { name: "Jul", total: 550, success: 480 },
  { name: "Aug", total: 520, success: 480 },
  { name: "Sep", total: 580, success: 420 },
  { name: "Oct", total: 500, success: 520 },
  { name: "Nov", total: 600, success: 350 },
  { name: "Dec", total: 500, success: 400 },
];

// Mock data for heatmap (7 days x 7 hours)
// Days: Sun, Mon, Tue, Wed, Thu, Fri, Sat
// Hours: 9am - 3pm
const heatmapData = Array.from({ length: 7 }, (_, hourIndex) => {
  return Array.from({ length: 7 }, (_, dayIndex) => {
    // Generate some random intensity 0-4
    // Make Wednesday (index 3) at 1pm (index 4) higher
    if (dayIndex === 3 && hourIndex === 4) return 4;
    if (dayIndex === 3 && hourIndex === 5) return 3;
    if (dayIndex === 3 && hourIndex === 3) return 3;
    if (dayIndex === 3 && hourIndex === 2) return 2;
    if (dayIndex === 2 && hourIndex === 4) return 2;
    if (dayIndex === 4 && hourIndex === 4) return 2;
    return Math.floor(Math.random() * 2);
  });
});

const hours = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HeatmapCell = ({
  intensity,
  value,
}: {
  intensity: number;
  value?: number;
}) => {
  const getColor = (i: number) => {
    switch (i) {
      case 0:
        return "bg-violet-50/50"; // very light
      case 1:
        return "bg-violet-100";
      case 2:
        return "bg-violet-200";
      case 3:
        return "bg-violet-300";
      case 4:
        return "bg-violet-400";
      default:
        return "bg-violet-50/50";
    }
  };

  return (
    <div
      className={`h-8 w-full rounded-md ${getColor(
        intensity,
      )} relative group cursor-pointer transition-colors hover:ring-2 hover:ring-violet-500`}
    >
      {intensity >= 3 && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg pointer-events-none">
          {value || 237}
        </div>
      )}
    </div>
  );
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { color: string; name: string; value: string }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 min-w-45">
        <p className="text-sm font-medium mb-3 text-slate-700">
          {label} 24, 2024
        </p>
        <div className="space-y-2">
          {payload.map(
            (
              entry: { color: string; name: string; value: string },
              index: number,
            ) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-500 font-medium">{entry.name}</span>
                <span className="font-bold text-slate-700 ml-auto">
                  {entry.value}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Top Cards Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="group relative cursor-pointer"
        >
          <StatCard title="Gross Revenue" data={analyticsData.grossRevenue} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 * 0.1 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="group relative cursor-pointer"
        >
          <StatCard
            title="Avg. Order Value"
            data={analyticsData.avgOrderValue}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 * 0.1 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="group relative cursor-pointer"
        >
          <StatCard title="Total Orders" data={analyticsData.totalOrders} />
        </motion.div>
      </div>

      {/* Bottom Charts Row */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Orders by Time Heatmap - Takes up 3 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="col-span-3"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-normal">
                Orders by time
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>0</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-violet-50 rounded-[2px]"></div>
                  <div className="w-3 h-3 bg-violet-100 rounded-[2px]"></div>
                  <div className="w-3 h-3 bg-violet-200 rounded-[2px]"></div>
                  <div className="w-3 h-3 bg-violet-300 rounded-[2px]"></div>
                  <div className="w-3 h-3 bg-violet-400 rounded-[2px]"></div>
                </div>
                <span>2500</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-4 grid grid-cols-[auto_1fr] gap-4">
                {/* Y-axis Labels */}
                <div className="flex flex-col justify-between py-2 text-xs text-muted-foreground gap-2">
                  {hours.map((hour) => (
                    <div key={hour} className="h-8 flex items-center">
                      {hour}
                    </div>
                  ))}
                </div>

                {/* Heatmap Grid */}
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-7 gap-2">
                    {heatmapData.map((row, i) => (
                      <React.Fragment key={i}>
                        {row.map((intensity, j) => (
                          <HeatmapCell
                            key={`${i}-${j}`}
                            intensity={intensity}
                            value={i === 4 && j === 3 ? 237 : undefined}
                          />
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                  {/* X-axis Labels */}
                  <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground text-center mt-2">
                    {days.map((day) => (
                      <div key={day}>{day}</div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transaction Activity Chart - Takes up 4 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="col-span-4"
        >
          <Card className="col-span-4">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-medium">
                Transaction activity
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pl-0">
              <div className="h-75 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={transactionData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      tickFormatter={(value) =>
                        value >= 1000 ? `${value / 1000}K` : value
                      }
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ strokeDasharray: "4 4", stroke: "#9ca3af" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      // name="Total transaction"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#8b5cf6" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="success"
                      name="Success Transaction"
                      stroke="#374151"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#374151" }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ display: "none" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  data,
}: {
  title: string;
  data: typeof analyticsData.grossRevenue;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal text-muted-foreground">
          <TextAnimation>{title}</TextAnimation>
        </CardTitle>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            data.isPositive
              ? "text-green-500 bg-green-50"
              : "text-red-500 bg-red-50"
          } px-2 py-1 rounded-md`}
        >
          {data.isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <TextAnimation delay={0.2}>
            {data.change.toString() + "%"}
          </TextAnimation>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          <TextAnimation delay={0.3} duration={1}>
            {data.value}
          </TextAnimation>
        </div>
        <div className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
          <TextAnimation delay={0.1} duration={0.1} split="letter">
            {data.dateRange}
          </TextAnimation>
        </div>
      </CardContent>
    </Card>
  );
};

export default Analytics;
