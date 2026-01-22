export type TCourseLearningData = {
  content: string;
  course: {
    id: string;
    title: string;
  };
  createdAt: string;
  id: string;
  isActive: boolean;
  order: number;
};
