import { TCourse } from "./course.types";

export type TCertificate = {
  id: string;
  userId: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    profilePhoto?: string;
  };
  courseId: string;
  course: TCourse;
  issuedAt: string;
  certificatImage: string;
  createdAt: string;
  updatedAt: string;
};
