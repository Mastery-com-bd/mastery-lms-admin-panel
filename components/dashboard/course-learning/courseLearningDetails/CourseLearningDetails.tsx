"use client";

import { TCourseLearningData } from "@/types/courseLearning.types";

const CourseLearningDetails = ({
  courseLearning,
}: {
  courseLearning: TCourseLearningData;
}) => {
  console.log(courseLearning);
  return <div>this is course learning details</div>;
};

export default CourseLearningDetails;
