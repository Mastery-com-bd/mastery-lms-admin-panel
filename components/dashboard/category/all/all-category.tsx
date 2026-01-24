"use client";
import { Card } from "@/components/ui/card";
import { TCategory } from "@/types/category.types";
import { TMeta } from "@/types/types.meta";
import CustomPagination from "@/components/ui/CustomPagination";
import CategoryFiltering from "./CategoryFiltering";
import { categoryTableColumn } from "./CategoryTableColumn";
import CustomTable from "@/components/ui/CustomTable";
import CreateCategory from "./CreateCategory";

const AllCategory = ({
  categories,
  meta,
}: {
  categories: TCategory[];
  meta: TMeta;
}) => {
  const columns = categoryTableColumn();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          All Categories
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

export default AllCategory;
