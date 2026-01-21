import { TCategory } from "./category.types";

export interface TCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  discountPrice: number | null;
  status: string;
  level: string;
  courseLeaningType: string;
  language: string;
  category: TCategory;
  createdAt: string;
  totalLessons: number;
  enrolledCount: number;
}
