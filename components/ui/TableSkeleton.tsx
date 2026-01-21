import { Skeleton } from "./skeleton";

const GlobalTableSkeleton = ({
  row,
  column,
}: {
  row: number;
  column: number;
}) => {
  return (
    <table className="w-full caption-bottom text-sm">
      {/* Header Skeleton */}
      <thead>
        <tr className="border-b">
          {[...Array(column)].map((_, i) => (
            <th key={i} className="h-12 px-4">
              <Skeleton className="h-6 w-28" />
            </th>
          ))}
        </tr>
      </thead>

      {/* Body Skeleton */}
      <tbody>
        {[...Array(row)].map((_, rowIndex) => (
          <tr key={rowIndex} className="border-b transition-colors">
            {[...Array(column)].map((_, colIndex) => (
              <td key={colIndex} className="p-4">
                <Skeleton className="h-6 w-full max-w-16" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GlobalTableSkeleton;
