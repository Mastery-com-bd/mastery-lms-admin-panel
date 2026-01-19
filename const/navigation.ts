import {
  BarChart3,
  Bell,
  BookOpen,
  DotSquareIcon,
  FileQuestion,
  GraduationCap,
  GripHorizontal,
  Headset,
  Layers,
  LayoutDashboard,
  LightbulbIcon,
  LucideIcon,
  Settings,
  User,
  Users,
  Video,
} from "lucide-react";

type TNavigation = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  items?: TNavigation[];
};

export const navigation: TNavigation[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
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
    title: "Supports",
    icon: Headset,
    items: [
      {
        title: "All Supports",
        url: "/dashboard/supports",
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
