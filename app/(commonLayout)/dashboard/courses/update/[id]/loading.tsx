import {
    Card,
    CardContent,
    CardHeader
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const UpdateCourseSkeleton = () => {
  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center gap-4 mb-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-7 w-40" />
          </div>
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                {/* Subtitle */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                {/* Category */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                {/* Level */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            </div>

            {/* Descriptions Section */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              {/* Short Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Full Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-37.5 w-full rounded-md" />
              </div>
            </div>

            {/* Details & Pricing Section */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-44" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Language */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                {/* Learning Type */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                {/* Duration */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                {/* Price */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                {/* Discount Price */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            </div>

            {/* Status & Settings Section */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                {/* Featured Toggle */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-11 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-36 rounded-md" />
                  <Skeleton className="h-4 w-40" />
                </div>
                {/* Image Preview */}
                <Skeleton className="w-full max-w-sm aspect-video rounded-lg" />
                <Skeleton className="h-3 w-80" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Skeleton className="h-10 w-20 rounded-md" />
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateCourseSkeleton;