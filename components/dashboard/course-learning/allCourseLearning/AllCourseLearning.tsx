"use client";

import { Card } from "@/components/ui/card";
import { TCourse } from "@/types/course.types";
import CreateCourseLearning from "./CreateCourseLearning";
import { TMeta } from "@/types/types.meta";
import CustomPagination from "@/components/ui/CustomPagination";
import CourseLearningFiltering from "./CourseLearningFiltering";
import { courseLearningTableColumn } from "./CourseLearningTable";
import CustomTable from "@/components/ui/CustomTable";
import { TCourseLearningData } from "@/types/courseLearning.types";

type TAllCourseLearningProps = {
  course: TCourse[];
  learning: TCourseLearningData[];
  meta: TMeta;
};

const AllCourseLearning = ({
  course,
  learning,
  meta,
}: TAllCourseLearningProps) => {
  const columns = courseLearningTableColumn(course);
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Course Learning
        </h1>
        <CreateCourseLearning course={course} />
      </div>
      <Card className="border-none shadow-sm py-4">
        <CourseLearningFiltering />
        {/* Table */}
        <CustomTable data={learning} columns={columns} />
        {/* Pagination */}
        <CustomPagination pagination={meta} />
      </Card>
    </div>
  );
};

export default AllCourseLearning;
