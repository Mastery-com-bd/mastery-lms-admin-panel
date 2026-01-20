"use client";
import { TCategory } from "@/types/category.types";
import CreateCategory from "./CreateCategory";
import { TMeta } from "@/types/types.meta";
import { bookcCategoryTableColumn } from "./BookCategoryTableColumn";
import { Card } from "@/components/ui/card";
import CategoryFiltering from "../../category/all/CategoryFiltering";
import CustomTable from "@/components/ui/CustomTable";
import CustomPagination from "@/components/ui/CustomPagination";

const AllBookscategories = ({
  categories,
  meta,
}: {
  categories: TCategory[];
  meta: TMeta;
}) => {
  const columns = bookcCategoryTableColumn();
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          All Books Categories
        </h1>
        <CreateCategory />
      </div>
      <Card className="border-none shadow-sm py-4">
        <CategoryFiltering />
        {/* Table */}
        <CustomTable data={categories} columns={columns} />

        {/* Pagination */}
        <CustomPagination pagination={meta} />
      </Card>
    </div>
  );
};

export default AllBookscategories;
