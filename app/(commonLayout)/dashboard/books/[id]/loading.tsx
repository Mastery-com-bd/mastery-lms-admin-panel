import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const BookDetailsSkeleton = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <Skeleton className="h-10 w-40 rounded-md" />

      {/* Book Header Card */}
      <Card className="lg:flex lg:gap-6 p-4 lg:p-6">
        {/* Book Image */}
        <Skeleton className="shrink-0 lg:w-64 h-80 rounded-lg" />

        <CardContent className="space-y-4 flex-1 mt-4 lg:mt-0">
          <CardHeader className="p-0">
            {/* Title */}
            <Skeleton className="h-8 w-3/4 mb-2" />
            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardHeader>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>

          <Separator />

          {/* Details */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
          </div>
        </CardContent>
      </Card>

      {/* Purchased By Table Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-48">
            {/* Table Header */}
            <div className="bg-muted p-2 flex gap-4 border-b">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            {/* Table Rows */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-2 flex gap-4 border-b">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookDetailsSkeleton;