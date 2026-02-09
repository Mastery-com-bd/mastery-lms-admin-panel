"use client";

import BackButton from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TSubject } from "@/types/subject.types";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  GraduationCap,
  Layout,
  Star,
  Users
} from "lucide-react";
import Image from "next/image";

const SubjectDetails = ({ subject }: { subject: TSubject }) => {
  const activeCoursesCount = subject.courses?.filter(c => c.status === "PUBLISHED").length || 0;
  const totalStudents = subject.courses?.reduce((acc, curr) => acc + (curr.enrolledCount || 0), 0) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* ===== Top Navigation ===== */}
      <div className="flex items-center justify-between">
        <BackButton label="Back to Subjects" />
        <div className="flex gap-2">
          {/* Action buttons could go here (Edit, Delete) */}
        </div>
      </div>

      {/* ===== Hero Header Section ===== */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/5 via-background to-background border shadow-sm">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <BookOpen className="w-64 h-64" />
        </div>
        
        <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
          {/* Icon/Image */}
          <div className="relative shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-md bg-background border-2 border-border/50">
            {subject.iconUrl ? (
              <Image
                src={subject.iconUrl}
                alt={subject.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                <Layout className="w-12 h-12" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={subject.isActive ? "default" : "secondary"} className="rounded-full px-3">
                  {subject.isActive ? "Active Subject" : "Inactive Subject"}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1 bg-background/50 px-2 py-0.5 rounded-md border">
                  <Clock className="w-3.5 h-3.5" />
                  Created {new Date(subject.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                {subject.name}
              </h1>
            </div>
            
            <p className="text-muted-foreground max-w-2xl leading-relaxed text-lg">
              {subject.description}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{subject.courses?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Courses</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-green-500/10 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{activeCoursesCount}</p>
                  <p className="text-xs text-muted-foreground">Published</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-blue-500/10 text-blue-600">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Total Students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* ===== Content Section ===== */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Associated Courses
            <Badge variant="secondary" className="ml-2 rounded-full">
              {subject.courses?.length || 0}
            </Badge>
          </h2>
          
          {/* Filter/Sort controls could go here */}
        </div>

        {subject.courses && subject.courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {subject.courses.map((course) => (
              <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 border-border/60 overflow-hidden flex flex-col h-full">
                {/* Thumbnail Section */}
                <div className="relative w-full aspect-video overflow-hidden bg-muted">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Thumbnail
                    </div>
                  )}
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Badge 
                      variant={course.status === "PUBLISHED" ? "default" : "secondary"}
                      className={course.status === "PUBLISHED" ? "bg-green-600 hover:bg-green-700" : "bg-yellow-500/90 hover:bg-yellow-600/90 text-white"}
                    >
                      {course.status}
                    </Badge>
                  </div>

                  {course.discountPrice && (
                    <div className="absolute bottom-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                      SALE
                    </div>
                  )}
                </div>

                <CardContent className="flex-1 p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 bg-secondary/50 px-2 py-0.5 rounded-full">
                        <GraduationCap className="w-3 h-3" />
                        {course.level}
                      </span>
                      <span className="flex items-center gap-1 bg-secondary/50 px-2 py-0.5 rounded-full">
                        <Globe className="w-3 h-3" />
                        {course.language}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    
                    {course.subtitle && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {course.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Price Section */}
                  <div className="flex items-baseline gap-2">
                    {course.discountPrice ? (
                      <>
                        <span className="text-lg font-bold text-primary">
                          ${course.discountPrice}
                        </span>
                        <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
                          ${course.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-primary">
                        ${course.price}
                      </span>
                    )}
                  </div>
                </CardContent>

                <Separator />

                <CardFooter className="p-4 bg-muted/30 text-xs text-muted-foreground grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-background transition-colors">
                    <Users className="w-4 h-4 mb-1" />
                    <span>{course.enrolledCount} Students</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-background transition-colors">
                    <FileText className="w-4 h-4 mb-1" />
                    <span>{course.totalLessons} Lessons</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-background transition-colors">
                    <Star className="w-4 h-4 mb-1 text-yellow-500" />
                    <span>{course.averageRating || 0} ({course.ratingsCount || 0})</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed rounded-xl bg-muted/30">
            <div className="bg-background p-4 rounded-full shadow-sm mb-4">
              <BookOpen className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold">No Courses Yet</h3>
            <p className="text-muted-foreground max-w-md mt-2 mb-6">
              This subject doesn&apos;t have any courses associated with it yet. Start by creating a new course and assigning it to this subject.
            </p>
            <Button>Create Course</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectDetails;
