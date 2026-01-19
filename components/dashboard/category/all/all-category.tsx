import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TCategory } from "@/types/category.types";
import Image from "next/image";
import { TMeta } from "@/types/types.meta";
import CustomPagination from "@/components/ui/CustomPagination";
import CategoryFiltering from "./CategoryFiltering";
import CategorySorting from "./CategorySorting";
import CategoryDropdown from "./CategoryDropdown";

const AllCategory = ({
  categories,
  meta,
}: {
  categories: TCategory[];
  meta: TMeta;
}) => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          All Categories
        </h1>
      </div>

      <Card className="border-none shadow-sm">
        <CategoryFiltering />
        {/* Table */}
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer">
                  <CategorySorting name="Name" sort="name" />
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Description
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer">
                  <CategorySorting name="Created At" sort="createdAt" />
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle font-medium">
                      <div className="flex items-center gap-2">
                        {category.iconUrl && (
                          <Image
                            height={50}
                            width={50}
                            src={category.iconUrl}
                            alt={category?.name}
                            className="h-6 w-6 object-contain"
                          />
                        )}
                        {category.name}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground max-w-75 truncate">
                      {category.description}
                    </td>
                    <td className="p-4 align-middle">
                      <Badge
                        variant={category.isActive ? "default" : "secondary"}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <CategoryDropdown id={category?.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <CustomPagination pagination={meta} />
      </Card>
    </div>
  );
};

export default AllCategory;
