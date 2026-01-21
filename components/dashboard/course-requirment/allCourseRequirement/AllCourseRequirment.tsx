"use client";

import { TCourse } from "@/types/course.types";
import { TMeta } from "@/types/types.meta";

type TAllCourseRequirmentProps = {
  course: TCourse[];
  meta: TMeta;
};

const AllCourseRequirment = ({ course, meta }: TAllCourseRequirmentProps) => {
  return <div>this is all course requirment</div>;
};

export default AllCourseRequirment;
