"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronRight,
  DotSquareIcon,
  FileQuestion,
  GraduationCap,
  GripHorizontal,
  Headset,
  Layers,
  LayoutDashboard,
  LightbulbIcon,
  Moon,
  Settings,
  Sun,
  User,
  Users,
  Video,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

const navigation = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Categories",
    icon: Layers,
    items: [
      {
        title: "All Categories",
        url: "/dashboard/categories",
      },
      {
        title: "Create Category",
        url: "/dashboard/categories/create",
      },
    ],
  },
  {
    title: "Courses",
    icon: BookOpen,
    items: [
      {
        title: "All Courses",
        url: "/dashboard/courses",
      },
      {
        title: "Create Course",
        url: "/dashboard/courses/create",
      },
      {
        title: "Course Reviews",
        url: "/dashboard/courses/reviews",
      },
    ],
  },
  {
    title: "Sections",
    icon: GripHorizontal,
    items: [
      {
        title: "All Sections",
        url: "/dashboard/section",
      },
      {
        title: "Create Section",
        url: "/dashboard/section/create",
      },
    ],
  },
  {
    title: "Lesson",
    icon: DotSquareIcon,
    items: [
      {
        title: "All Lessons",
        url: "/dashboard/lesson",
      },
      {
        title: "Create Lesson",
        url: "/dashboard/lesson/create",
      },
    ],
  },
  {
    title: "Quiz",
    icon: LightbulbIcon,
    items: [
      {
        title: "All Quizzes",
        url: "/dashboard/quiz",
      },
      {
        title: "Create Quiz",
        url: "/dashboard/quiz/create",
      },
    ],
  },
  {
    title: "Questions",
    icon: FileQuestion,
    items: [
      {
        title: "All Questions",
        url: "/dashboard/questions",
      },
      {
        title: "Create Question",
        url: "/dashboard/questions/create",
      },
    ],
  },
  {
    title: "Live Class",
    icon: Video,
    items: [
      {
        title: "All Live Classes",
        url: "/dashboard/live-class",
      },
      {
        title: "Create Live Class",
        url: "/dashboard/live-class/create",
      },
    ],
  },
  {
    title: "Students",
    icon: GraduationCap,
    items: [
      {
        title: "All Students",
        url: "/dashboard/students",
      },
      {
        title: "Enrollments",
        url: "/dashboard/students/enrollments",
      },
      {
        title: "Progress",
        url: "/dashboard/students/progress",
      },
    ],
  },
  {
    title: "Instructors",
    icon: User,
    items: [
      {
        title: "All Instructors",
        url: "/dashboard/instructors",
      },
      {
        title: "Applications",
        url: "/dashboard/instructors/applications",
      },
      {
        title: "Payouts",
        url: "/dashboard/instructors/payouts",
      },
    ],
  },
  {
    title: "Users",
    icon: Users,
    items: [
      {
        title: "All Users",
        url: "/dashboard/users",
      },
      {
        title: "Roles & Permissions",
        url: "/dashboard/users/roles",
      },
    ],
  },
  {
    title: "Quiz & Assignments",
    icon: LightbulbIcon,
    items: [
      {
        title: "All Quizzes",
        url: "/dashboard/quiz",
      },
      {
        title: "Create Quiz",
        url: "/dashboard/quiz/create",
      },
      {
        title: "Assignments",
        url: "/dashboard/assignments",
      },
    ],
  },
  {
    title: "Supports",
    url: "/dashboard/supports",
    icon: Headset,
  },
  {
    title: "Live Sessions",
    url: "/dashboard/live",
    icon: Video,
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export const AdminSidebar = memo(() => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link prefetch={false} href="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Mastery LMS</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;

                if (item.items) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={item.items.some((subItem) =>
                        pathname.startsWith(subItem.url)
                      )}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton asChild tooltip={item.title}>
                            <div className="flex items-center gap-2 w-full">
                              {item.icon && <item.icon className="h-4 w-4" />}
                              <span className="flex-1">{item.title}</span>
                              <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </div>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.url}
                                >
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url || "#"}>
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              tooltip={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Admin Profile">
              <Link prefetch={false} href="/dashboard/profile">
                <User />
                <span>Admin Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
});

AdminSidebar.displayName = "AdminSidebar";
