import {
  AlarmSmoke,
  BarChart3,
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
  SquaresSubtract,
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
    url: "/dashboard/categories",
    icon: Layers,
  },
  {
    title: "Subjects",
    url: "/dashboard/subjects",
    icon: SquaresSubtract,
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
    title: "Books",
    icon: BookOpen,
    items: [
      {
        title: "All Books",
        url: "/dashboard/books",
      },
      {
        title: "Books Category",
        url: "/dashboard/books/categories",
      },
    ],
  },
  {
    title: "Learning & Requirment",
    icon: AlarmSmoke,
    items: [
      {
        title: "Course Learning",
        url: "/dashboard/course-learning",
      },
      {
        title: "Course Requirment",
        url: "/dashboard/course-requirment",
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
    ],
  },
  {
    title: "Supports",
    url: "/dashboard/supports",
    icon: Headset,
  },
  {
    title: "Live Sessions",
    url: "/dashboard/live-class",
    icon: Video,
  },
];
