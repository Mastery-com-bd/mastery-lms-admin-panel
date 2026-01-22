"use client";

import { TBooks } from "@/types/product.types";
import { TMeta } from "@/types/types.meta";
import { Card } from "@/components/ui/card";
import CustomPagination from "@/components/ui/CustomPagination";
import { TCategory } from "@/types/category.types";
import CreateBook from "./CreateBook";
import { bookTableColumn } from "./AllBooksTableColumn";
import CustomTable from "@/components/ui/CustomTable";
import BooksFiltering from "./BooksFiltering";

type TAllBooksProps = { books: TBooks[]; meta: TMeta; categories: TCategory[] };

const AllBooks = ({ books, meta, categories }: TAllBooksProps) => {
  const columns = bookTableColumn(categories);
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          All Books Categories
        </h1>
        <CreateBook categories={categories} />
      </div>
      <Card className="border-none shadow-sm py-4">
        <BooksFiltering />
        {/* Table */}
        <CustomTable data={books} columns={columns} />

        {/* Pagination */}
        <CustomPagination pagination={meta} />
      </Card>
    </div>
  );
};

export default AllBooks;
