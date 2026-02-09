import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const CourseRequirmentLoading = () => {
  return (
    <div className="w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Skeleton */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg w-full">
        <CardHeader className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <div className="flex flex-wrap gap-3 items-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </CardHeader>
      </Card>

      {/* Content Skeleton */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg ">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>

        <CardContent>
          <div className="h-125 md:h-150 p-4 border rounded-lg space-y-4">
            {/* Simulated paragraph lines */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[92%]" />
            <Skeleton className="h-4 w-[88%]" />

            <div className="pt-4 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[93%]" />
              <Skeleton className="h-4 w-[85%]" />
            </div>

            <div className="pt-4 space-y-3">
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[75%]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseRequirmentLoading;
