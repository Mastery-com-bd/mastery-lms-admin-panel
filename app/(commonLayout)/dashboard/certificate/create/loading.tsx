import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CreateCertificateSkeleton = () => {
  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="mb-6">
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Student Selection Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Course Selection Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* File Upload Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-32 w-full rounded-md" />
              <Skeleton className="h-3 w-48" />
            </div>

            {/* Submit Button Skeleton */}
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCertificateSkeleton;