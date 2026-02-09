import { TCategory } from "./category.types";

export interface TSection {
  id: string;
  title: string;
  order: number;
  lessons: any[]; // Define TLesson type if available
}

export interface TRequirement {
  id: string;
  courseId: string;
  content: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TLearning {
  id: string;
  courseId: string;
  content: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TCourse {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description: string;
  shortDescription?: string | null;
  thumbnail: string;
  previewVideo?: string | null;
  courseTag?: string[];
  instructorId?: string | null;
  categoryId: string;
  subjectId?: string;
  price: number;
  discountPrice?: number | null;
  isFeatured?: boolean;
  status: string;
  courseLeaningType: string;
  language: string;
  level: string;
  duration?: number | null;
  totalLessons: number;
  totalQuizzes?: number;
  ratingsCount?: number;
  averageRating?: number;
  enrolledCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  category?: TCategory;
  subject?: {
    id: string;
    name: string;
    slug: string;
  };
  instructor?: {
    id: string;
    name: string;
    email: string;
  } | null;
  sections?: TSection[];
  requirements?: TRequirement[];
  learnings?: TLearning[];
  reviews?: any[];
}
