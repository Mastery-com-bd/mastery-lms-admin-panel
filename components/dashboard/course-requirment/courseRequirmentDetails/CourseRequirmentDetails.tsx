"use client";

import { TCourseLearningData } from "@/types/courseLearning.types";

const CourseRequirmentDetails = ({
  courseRequirment,
}: {
  courseRequirment: TCourseLearningData;
}) => {
  console.log(courseRequirment);
  return <div>this is course requirment details</div>;
};

export default CourseRequirmentDetails;
