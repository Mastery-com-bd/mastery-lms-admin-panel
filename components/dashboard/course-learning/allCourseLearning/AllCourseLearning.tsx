"use client";

import { Card } from "@/components/ui/card";
import { TCourse } from "@/types/course.types";
import CreateCourseLearning from "./CreateCourseLearning";
import { TCourseLearning } from "@/types/courseLearning.types";
import { TMeta } from "@/types/types.meta";
import CustomPagination from "@/components/ui/CustomPagination";

type TAllCourseLearningProps = {
  course: TCourse[];
  learning: TCourseLearning[];
  meta: TMeta;
};

const AllCourseLearning = ({
  course,
  learning,
  meta,
}: TAllCourseLearningProps) => {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Course Learning
        </h1>
        <CreateCourseLearning course={course} />
      </div>
      <Card className="border-none shadow-sm py-4">
        {/* <BooksFiltering /> */}
        {/* Table */}
        {/* <CustomTable data={books} columns={columns} /> */}
        {/* Pagination */}
        <CustomPagination pagination={meta} />
        this is table
      </Card>
    </div>
  );
};

export default AllCourseLearning;
