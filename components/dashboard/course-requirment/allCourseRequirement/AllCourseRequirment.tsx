"use client";

import { TCourse } from "@/types/course.types";
import { TMeta } from "@/types/types.meta";
import CreateAllCourseRequirment from "./CreateAllCourseRequirment";
import { Card } from "@/components/ui/card";
import CustomPagination from "@/components/ui/CustomPagination";
import AllCourseRequirmentFiltering from "./AllCourseRequirmentFiltering";
import { courseRequirmentTableColumn } from "./CourseRequirmentTableColumn";
import CustomTable from "@/components/ui/CustomTable";
import { TCourseLearning } from "@/types/courseLearning.types";

type TAllCourseRequirmentProps = {
  course: TCourse[];
  meta: TMeta;
  courseRequirment: TCourseLearning[];
};

const AllCourseRequirment = ({
  course,
  meta,
  courseRequirment,
}: TAllCourseRequirmentProps) => {
  const columns = courseRequirmentTableColumn();
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Course Requirment
        </h1>
        <CreateAllCourseRequirment course={course} />
      </div>
      <Card className="border-none shadow-sm py-4">
        <AllCourseRequirmentFiltering />
        {/* Table */}
        <CustomTable data={courseRequirment} columns={columns} />
        {/* Pagination */}
        <CustomPagination pagination={meta} />
      </Card>
    </div>
  );
};

export default AllCourseRequirment;
