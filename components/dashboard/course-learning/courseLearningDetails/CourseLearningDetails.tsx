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

const CourseLearningDetails = ({
  courseLearning,
}: {
  courseLearning: TCourseLearningData;
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Course Header */}
      <Card className="bg-white dark:bg-slate-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-bold">
            {courseLearning?.course?.title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1 md:mt-2 flex flex-wrap gap-2 items-center">
            <Separator orientation="vertical" className="h-4" />
            <span>
              <strong>Created:</strong>{" "}
              {new Date(courseLearning?.createdAt).toLocaleDateString()}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span>
              <strong>Order:</strong> {courseLearning?.order}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <Badge
              variant={courseLearning?.isActive ? "default" : "outline"}
              className="text-sm"
            >
              {courseLearning?.isActive ? "Active" : "Inactive"}
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
                __html: courseLearning?.content || "",
              }}
            />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseLearningDetails;
