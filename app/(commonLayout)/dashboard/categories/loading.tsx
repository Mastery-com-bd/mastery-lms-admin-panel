import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = () => {
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
        <table className="w-full caption-bottom text-sm">
          {/* Header Skeleton */}
          <thead>
            <tr className="border-b">
              {[...Array(5)].map((_, i) => (
                <th key={i} className="h-12 px-4">
                  <Skeleton className="h-6 w-28" />
                </th>
              ))}
            </tr>
          </thead>

          {/* Body Skeleton */}
          <tbody>
            {[...Array(10)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b transition-colors">
                {[...Array(5)].map((_, colIndex) => (
                  <td key={colIndex} className="p-4">
                    <Skeleton className="h-6 w-full max-w-40" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default TableSkeleton;
