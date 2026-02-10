"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import {
  DollarSign,
  Users,
  BookOpen,
  GraduationCap,
  UserCheck,
  PlayCircle,
} from "lucide-react";
import { DashboardCard } from "./components/dashboard-card";
import { RevenueChart } from "./components/revenue-chart";
import { UserGrowthChart } from "./components/user-growth-chart";

interface AnalyticsData {
  month: string;
  revenue: number;
}

interface UserGrowthData {
  date: string;
  users: number;
}

interface EnrollmentsData {
  monthlyTotalEnrollments: number;
  todayTotalEnrollments: number;
  weeklyTotalEnrollments: number;
}

interface SummaryData {
  totalActiveUsers: number;
  totalCourseEnrolled: number;
  totalCourseRevenue: number;
  totalCourses: number;
  totalEnrolledCourseCompleted: number;
  totalFreeCourses: number;
  totalInstructors: number;
  totalProductRevenue: number;
  totalStudents: number;
}

interface DashboardData {
  charts: {
    revenueAnalytics: AnalyticsData[];
    userGrowth: UserGrowthData[];
  };
  enrollments: EnrollmentsData;
  summary: SummaryData;
}

interface AdminDashboardProps {
  data: DashboardData;
}

export default function AdminDashboard({ data }: AdminDashboardProps) {
  const overviewStats = [
    {
      title: "Total Students",
      value: data?.summary?.totalStudents.toLocaleString(),
      change: "Total registered",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Revenue",
      value: `$${(data?.summary?.totalCourseRevenue + data?.summary?.totalProductRevenue).toLocaleString()}`,
      change: "Course + Product",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Active Users",
      value: data?.summary?.totalActiveUsers.toLocaleString(),
      change: "Currently active",
      changeType: "positive" as const,
      icon: UserCheck,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Total Courses",
      value: data?.summary?.totalCourses.toLocaleString(),
      change: `${data?.summary?.totalFreeCourses} Free Courses`,
      changeType: "positive" as const,
      icon: BookOpen,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const enrollmentStats = [
    {
      title: "Today's Enrollments",
      value: data?.enrollments?.todayTotalEnrollments.toLocaleString(),
      change: "Daily count",
      changeType: "positive" as const,
      icon: GraduationCap,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Weekly Enrollments",
      value: data?.enrollments?.weeklyTotalEnrollments.toLocaleString(),
      change: "Last 7 days",
      changeType: "positive" as const,
      icon: GraduationCap,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      title: "Monthly Enrollments",
      value: data?.enrollments?.monthlyTotalEnrollments.toLocaleString(),
      change: "This month",
      changeType: "positive" as const,
      icon: GraduationCap,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Course Completions",
      value: data?.summary?.totalEnrolledCourseCompleted.toLocaleString(),
      change: "All time",
      changeType: "positive" as const,
      icon: PlayCircle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div>
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4">
          <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-4">
            <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
              <div className="px-2 sm:px-0">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Welcome Admin
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Here&apos;s what&apos;s happening with your platform today.
                </p>
              </div>

              {/* Overview Stats */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                {overviewStats?.map((stat, index) => (
                  <DashboardCard key={stat.title} stat={stat} index={index} />
                ))}
              </div>

              {/* Enrollment Stats */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                {enrollmentStats?.map((stat, index) => (
                  <DashboardCard
                    key={stat.title}
                    stat={stat}
                    index={index + 4}
                  />
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
                {data?.charts?.revenueAnalytics && (
                  <RevenueChart data={data?.charts?.revenueAnalytics} />
                )}

                <UserGrowthChart data={data?.charts?.userGrowth} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}
