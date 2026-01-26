import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CreateCourseLoading = () => {
  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-4xl animate-pulse">
        {/* Card Header */}
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-1/3" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full md:col-span-2" />
              <Skeleton className="h-10 w-full md:col-span-2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full md:col-span-2" />
            </div>
          </div>

          {/* Descriptions Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>

          {/* Details & Pricing Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-40 w-full md:max-w-sm rounded-lg" />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-36" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCourseLoading;
