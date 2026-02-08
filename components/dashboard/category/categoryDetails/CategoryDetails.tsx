"use client";

import BackButton from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, FileText, Layers, Link as LinkIcon } from "lucide-react";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  // Add other course properties if known, otherwise optional
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  courses?: Course[];
}

interface CategoryDetailsProps {
  category: Category;
}

const CategoryDetails = ({ category }: CategoryDetailsProps) => {

  if (!category) {
    return <div className="p-6">Category not found</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <BackButton 
        label="Back to Categories" 
        variant="ghost" 
        className="mb-4 pl-0 hover:bg-transparent hover:text-primary" 
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Info */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={category.isActive ? "default" : "destructive"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-2xl">{category.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <LinkIcon className="w-3 h-3" />
                    <span>Slug: {category.slug}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Description
                </h3>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-foreground whitespace-pre-wrap">
                    {category.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Courses Section - Placeholder for now if courses array is empty */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Associated Courses ({category.courses?.length || 0})
                </h3>
                {category.courses && category.courses.length > 0 ? (
                  <div className="grid gap-2">
                    {category.courses.map((course) => (
                      <div key={course.id} className="p-3 border rounded-md">
                        {course.title}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic p-2">
                    No courses associated with this category.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar / Icon */}
        <div className="w-full md:w-80 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category Icon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
                {category.iconUrl ? (
                  <Image
                    src={category.iconUrl}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No Icon
                  </div>
                )}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-mono text-xs" title={category.id}>{category.id.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{new Date(category.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;
