import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import GlobalTableSkeleton from "@/components/ui/TableSkeleton";

const BookCategoryLoadingSkeleton = () => {
  return (
    <div className="px-10 py-6 space-y-4">
      <div className="w-full md:w-40">
        <Skeleton className="h-10 w-72 rounded-md" />
      </div>
      <Card className="border-none shadow-sm py-4">
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between border-b">
          {/* Left side */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center flex-1">
            {/* Search Input */}
            <div className="w-full md:w-72">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Select */}
            <div className="w-full md:w-40">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Filter Button */}
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
        <GlobalTableSkeleton row={10} column={5} />
      </Card>
    </div>
  );
};

export default BookCategoryLoadingSkeleton;
