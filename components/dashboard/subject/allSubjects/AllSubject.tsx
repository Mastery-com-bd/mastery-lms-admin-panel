"use client";

import { Card } from "@/components/ui/card";
import { TSubject } from "@/types/subject.types";
import { TMeta } from "@/types/types.meta";
import CustomPagination from "@/components/ui/CustomPagination";
import CustomTable from "@/components/ui/CustomTable";
import { subjectTableColumn } from "./SubjectTableColumn";
import CreateSubject from "./CreateSubject";
import CategoryFiltering from "../../category/all/CategoryFiltering";

const AllSubject = ({
  subjects,
  meta,
}: {
  subjects: TSubject[];
  meta: TMeta;
}) => {
  const columns = subjectTableColumn();
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">All Subjects</h1>
        <CreateSubject />
      </div>
      <Card className="border-none shadow-sm py-4">
        <CategoryFiltering />
        {/* Table */}
        <CustomTable data={subjects} columns={columns} />

        {/* Pagination */}
        <CustomPagination pagination={meta} />
      </Card>
    </div>
  );
};

export default AllSubject;
