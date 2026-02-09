"use client";

import { TCourse } from "@/types/course.types";
import { TMeta } from "@/types/types.meta";
import { Card } from "@/components/ui/card";
import CustomPagination from "@/components/ui/CustomPagination";
import AllCourseRequirmentFiltering from "./AllCourseRequirmentFiltering";
import { courseRequirmentTableColumn } from "./CourseRequirmentTableColumn";
import CustomTable from "@/components/ui/CustomTable";
import { TCourseLearningData } from "@/types/courseLearning.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type TAllCourseRequirmentProps = {
  course: TCourse[];
  meta: TMeta;
  courseRequirment: TCourseLearningData[];
};

const AllCourseRequirment = ({
  course,
  meta,
  courseRequirment,
}: TAllCourseRequirmentProps) => {
  const columns = courseRequirmentTableColumn(course);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Course Requirment
        </h1>
        <Link href="/dashboard/course-requirment/create">
          <Button className="cursor-pointer">Create Course Requirement</Button>
        </Link>
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
