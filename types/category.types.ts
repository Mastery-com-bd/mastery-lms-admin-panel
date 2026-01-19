import { TCourse } from "./course.types";

export type TCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  courses: TCourse[];
};
