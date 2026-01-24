import { TCourse } from "./course.types";

export type TSubject = {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  courses?: TCourse[];
};
