"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TCourseLearningData } from "@/types/courseLearning.types";

const CourseRequirmentDetails = ({
  courseRequirment,
}: {
  courseRequirment: TCourseLearningData;
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Course Header */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold">
            {courseRequirment?.course?.title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1 md:mt-2 flex flex-wrap gap-2 items-center">
            <Separator orientation="vertical" className="h-4" />
            <span>
              <strong>Created:</strong>{" "}
              {new Date(courseRequirment?.createdAt).toLocaleDateString()}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span>
              <strong>Order:</strong> {courseRequirment?.order}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <Badge
              variant={courseRequirment?.isActive ? "default" : "outline"}
              className="text-sm"
            >
              {courseRequirment?.isActive ? "Active" : "Inactive"}
            </Badge>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Course Content */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-semibold">
            Course Learning Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-125 md:h-150 p-2 rounded-lg border">
            <div
              className="prose prose-slate dark:prose-invert max-w-none wrap-break-word"
              dangerouslySetInnerHTML={{
                __html: courseRequirment?.content || "",
              }}
            />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseRequirmentDetails;
